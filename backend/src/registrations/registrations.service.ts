import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassType, PaymentStatus, Prisma, Role, User } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { generateSignedQrToken, generateQrDataUrl } from '../common/utils/qr.util'
import { generateUniqueReferralCode } from '../common/utils/referral.util'
import { CreateRegistrationDto } from './dto/create-registration.dto'
import { PASS_TIERS_CATALOG } from './pass-types.config'
import { randomInt } from 'node:crypto'
import { EmailService } from '../email/email.service'

@Injectable()
export class RegistrationsService {
  private readonly logger = new Logger(RegistrationsService.name)
  private readonly qrSecret: string

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly emailService: EmailService
  ) {
    this.qrSecret = this.config.getOrThrow<string>('QR_HMAC_SECRET')
  }

  async getPassCatalog() {
    const counts = await this.prisma.registration.groupBy({
      by: ['passType'],
      _count: { id: true },
    })

    const countsMap = new Map<PassType, number>()
    for (const c of counts) {
      countsMap.set(c.passType, c._count.id)
    }

    return PASS_TIERS_CATALOG.map((tier) => ({
      ...tier,
      totalIssued: countsMap.get(tier.enumType) ?? 0,
    }))
  }

  async createRegistration(dto: CreateRegistrationDto, authUserId?: string) {
    const catalogItem = PASS_TIERS_CATALOG.find((t) => t.enumType === dto.passType)
    if (!catalogItem) {
      throw new BadRequestException(`Unknown pass type: ${dto.passType}`)
    }

    let user: User
    if (authUserId) {
      const existing = await this.prisma.user.findUnique({ where: { id: authUserId } })
      if (!existing) throw new NotFoundException('Authenticated user not found.')
      user = existing
    } else {
      const normalizedEmail = dto.email.toLowerCase().trim()
      const existing = await this.prisma.user.findUnique({ where: { email: normalizedEmail } })
      if (existing) {
        const patchExisting: Record<string, unknown> = {}
        if (!existing.phone && dto.phone) patchExisting.phone = dto.phone.trim()
        if (!existing.college && dto.college) patchExisting.college = dto.college.trim()
        if (!existing.gradYear && dto.gradYear) patchExisting.gradYear = dto.gradYear.trim()
        if (!existing.city && dto.city) patchExisting.city = dto.city.trim()
        if (!existing.state && dto.state) patchExisting.state = dto.state.trim()
        if (!existing.district && dto.district) patchExisting.district = dto.district.trim()

        if (Object.keys(patchExisting).length > 0) {
          user = await this.prisma.user.update({
            where: { id: existing.id },
            data: patchExisting,
          })
        } else {
          user = existing
        }
      } else {
        let referredById: string | undefined
        if (dto.referralCode) {
          const referrer = await this.prisma.user.findFirst({
            where: { referralCode: dto.referralCode.trim().toUpperCase() },
          })
          if (referrer) {
            referredById = referrer.id
          }
        }

        let generatedReferralCode: string | undefined
        if (dto.passType === PassType.CAMPUS_AMBASSADOR) {
          generatedReferralCode = await generateUniqueReferralCode(this.prisma, 'CA-')
        }

        user = await this.prisma.user.create({
          data: {
            email: normalizedEmail,
            name: dto.name.trim(),
            phone: dto.phone?.trim(),
            college: dto.college?.trim(),
            gradYear: dto.gradYear?.trim(),
            city: dto.city?.trim(),
            state: dto.state?.trim(),
            district: dto.district?.trim(),
            role: Role.USER,
            referralCode: generatedReferralCode,
            referredById,
          },
        })
      }
    }

    // Check for existing registration to allow updating/switching passes
    let existingReg = dto.existingPassId
      ? await this.prisma.registration.findFirst({
          where: {
            passId: dto.existingPassId,
            userId: user.id,
          },
          include: { payment: true },
        })
      : null

    if (!existingReg) {
      existingReg = await this.prisma.registration.findFirst({
        where: {
          userId: user.id,
          passType: dto.passType,
        },
        include: { payment: true },
      })
    }

    // For student passes (STUDENT_GENERAL or HACKATHON_BUILDER), allow switching between tiers
    if (
      !existingReg &&
      (dto.passType === PassType.STUDENT_GENERAL || dto.passType === PassType.HACKATHON_BUILDER)
    ) {
      existingReg = await this.prisma.registration.findFirst({
        where: {
          userId: user.id,
          passType: { in: [PassType.STUDENT_GENERAL, PassType.HACKATHON_BUILDER] },
        },
        include: { payment: true },
        orderBy: { createdAt: 'desc' },
      })
    }

    if (existingReg) {
      const fee = catalogItem.feeAmount
      const isPaid = fee > 0

      // Update user details if provided
      const userUpdate: Record<string, string> = {}
      if (dto.name?.trim()) userUpdate.name = dto.name.trim()
      if (dto.phone?.trim()) userUpdate.phone = dto.phone.trim()
      if (dto.college?.trim()) userUpdate.college = dto.college.trim()
      if (dto.gradYear?.trim()) userUpdate.gradYear = dto.gradYear.trim()
      if (dto.city?.trim()) userUpdate.city = dto.city.trim()
      if (dto.state?.trim()) userUpdate.state = dto.state.trim()
      if (dto.district?.trim()) userUpdate.district = dto.district.trim()

      if (Object.keys(userUpdate).length > 0) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: userUpdate,
        })
      }

      // Update existing registration record (passType, tracks, fee)
      const updatedRegistration = await this.prisma.registration.update({
        where: { id: existingReg.id },
        data: {
          passType: dto.passType,
          amountPaid: fee,
          tracks: dto.tracks && dto.tracks.length > 0 ? dto.tracks : existingReg.tracks,
          isRevoked: false,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              college: true,
              phone: true,
            },
          },
          payment: true,
        },
      })

      this.logger.log(
        `Pass ${existingReg.passId} updated/switched to [${dto.passType}] for user ${user.email}`,
      )

      const formattedResponse = await this.formatRegistrationResponse(updatedRegistration)

      if (!isPaid) {
        this.emailService
          .sendPassConfirmationEmail({
            to: user.email,
            recipientName: user.name,
            passId: updatedRegistration.passId,
            passType: updatedRegistration.passType,
            qrDataUrl: formattedResponse.qrCodeDataUrl,
            college: user.college ?? undefined,
            amountPaid: 0,
          })
          .catch((err) =>
            this.logger.error(`Pass email background dispatch failed: ${err.message}`),
          )
      }

      return {
        registration: formattedResponse,
        isPaymentRequired: isPaid,
        catalogInfo: catalogItem,
        isUpdated: true,
        message: `Pass ${existingReg.passId} updated successfully.`,
      }
    }

    const passId = await this.generateUniquePassId()
    const qrToken = generateSignedQrToken(user.id, passId, this.qrSecret)
    const fee = catalogItem.feeAmount
    const isPaid = fee > 0

    const registration = await this.prisma.$transaction(async (tx) => {
      let paymentId: string | undefined

      if (isPaid) {
        const orderId = `order_${passId.replace('-', '_')}_${Date.now()}`
        const payment = await tx.payment.create({
          data: {
            orderId,
            amount: fee,
            currency: 'INR',
            status: PaymentStatus.PENDING,
          },
        })
        paymentId = payment.id
      }

      return tx.registration.create({
        data: {
          passId,
          userId: user.id,
          passType: dto.passType,
          amountPaid: fee,
          qrToken,
          paymentId,
          tracks: dto.tracks && dto.tracks.length > 0 ? dto.tracks : ['General Sessions'],
          isCheckedIn: false,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              college: true,
              phone: true,
            },
          },
          payment: true,
        },
      })
    })

    this.logger.log(`Pass ${passId} created for user ${user.email} [${dto.passType}]`)

    const formattedResponse = await this.formatRegistrationResponse(registration)

    // If pass is free, dispatch confirmation email immediately
    if (!isPaid) {
      this.emailService
        .sendPassConfirmationEmail({
          to: user.email,
          recipientName: user.name,
          passId: registration.passId,
          passType: registration.passType,
          qrDataUrl: formattedResponse.qrCodeDataUrl,
          college: user.college ?? undefined,
          amountPaid: 0,
        })
        .catch((err) => this.logger.error(`Pass email background dispatch failed: ${err.message}`))
    }

    return {
      registration: formattedResponse,
      isPaymentRequired: isPaid,
      catalogInfo: catalogItem,
    }
  }

  async getMyPasses(userId: string) {
    const passes = await this.prisma.registration.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            college: true,
            phone: true,
          },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return Promise.all(passes.map((p) => this.formatRegistrationResponse(p)))
  }

  async getPassById(passId: string, authUserId?: string) {
    const pass = await this.prisma.registration.findUnique({
      where: { passId: passId.trim().toUpperCase() },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            college: true,
            phone: true,
          },
        },
        payment: true,
      },
    })

    if (!pass) {
      throw new NotFoundException('Pass not found.')
    }

    let isAuthorized = false
    if (authUserId) {
      if (pass.userId === authUserId) {
        isAuthorized = true
      } else {
        const caller = await this.prisma.user.findUnique({
          where: { id: authUserId },
          select: { role: true },
        })
        if (caller?.role === Role.ADMIN || caller?.role === Role.GATE) {
          isAuthorized = true
        }
      }
    }

    if (isAuthorized) {
      return await this.formatRegistrationResponse(pass)
    }

    const catalogItem = PASS_TIERS_CATALOG.find((t) => t.enumType === pass.passType)
    const qrCodeDataUrl = await generateQrDataUrl(pass.qrToken)

    return {
      passId: pass.passId,
      passType: pass.passType,
      categoryTitle: catalogItem?.title ?? pass.passType,
      badgeTitle: catalogItem?.badgeTitle ?? 'DELEGATE',
      isCheckedIn: pass.isCheckedIn,
      isRevoked: pass.isRevoked ?? false,
      tracks: pass.tracks,
      qrToken: pass.qrToken,
      qrCodeDataUrl,
      createdAt: pass.createdAt,
    }
  }

  async revokePass(passIdOrRegId: string, revokedByUserId: string) {
    const reg = await this.prisma.registration.findFirst({
      where: {
        OR: [{ id: passIdOrRegId }, { passId: passIdOrRegId.toUpperCase() }],
      },
    })

    if (!reg) {
      throw new NotFoundException(`Registration with identifier "${passIdOrRegId}" not found.`)
    }

    if (reg.isRevoked) {
      throw new ConflictException(`Pass ${reg.passId} is already revoked.`)
    }

    const updated = await this.prisma.registration.update({
      where: { id: reg.id },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
        revokedById: revokedByUserId,
      },
      include: {
        user: true,
        payment: true,
      },
    })

    this.logger.warn(`Pass ${updated.passId} revoked by user ${revokedByUserId}`)
    return await this.formatRegistrationResponse(updated)
  }

  private async generateUniquePassId(): Promise<string> {
    for (let attempts = 0; attempts < 10; attempts++) {
      const code = `PEC-${randomInt(100_000, 999_999)}`
      const exists = await this.prisma.registration.findUnique({
        where: { passId: code },
        select: { id: true },
      })
      if (!exists) return code
    }
    return `PEC-${Date.now().toString().slice(-6)}`
  }

  private async formatRegistrationResponse(
    reg: Prisma.RegistrationGetPayload<{
      include: {
        user: { select: { id: true; name: true; email: true; college: true; phone: true } }
        payment: true
      }
    }>
  ) {
    const catalogItem = PASS_TIERS_CATALOG.find((t) => t.enumType === reg.passType)
    const qrCodeDataUrl = await generateQrDataUrl(reg.qrToken)

    return {
      id: reg.id,
      passId: reg.passId,
      passType: reg.passType,
      categoryTitle: catalogItem?.title ?? reg.passType,
      badgeTitle: catalogItem?.badgeTitle ?? 'DELEGATE',
      amountPaid: reg.amountPaid,
      isCheckedIn: reg.isCheckedIn,
      isRevoked: reg.isRevoked ?? false,
      revokedAt: reg.revokedAt ?? null,
      tracks: reg.tracks,
      qrToken: reg.qrToken,
      qrCodeDataUrl,
      createdAt: reg.createdAt,
      user: reg.user,
      payment: reg.payment
        ? {
            orderId: reg.payment.orderId,
            status: reg.payment.status,
            amount: reg.payment.amount,
          }
        : null,
    }
  }
}
