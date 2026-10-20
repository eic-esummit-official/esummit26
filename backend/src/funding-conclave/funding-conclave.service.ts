import {
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common'
import { randomBytes } from 'node:crypto'
import { PrismaService } from '../prisma/prisma.service'
import { RegistrationsService } from '../registrations/registrations.service'
import { CreateFundingConclaveApplicationDto } from './dto/create-application.dto'
import { PassType } from '@prisma/client'

@Injectable()
export class FundingConclaveService {
  private readonly logger = new Logger(FundingConclaveService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly registrations: RegistrationsService,
  ) {}

  /**
   * Upsert a startup / founder pass application.
   * One application per email — resubmitting overwrites the previous record.
   */
  async apply(dto: CreateFundingConclaveApplicationDto) {
    const email = dto.email.trim().toLowerCase()
    const applicationId = `PEC-FC-${randomBytes(3).toString('hex').toUpperCase()}`

    // Upsert: delete existing record for this email then insert fresh.
    await this.prisma.fundingConclaveApplication.deleteMany({ where: { email } })

    const founderName = (dto.founderName || dto.fullName || '').trim()
    const founderLinkedIn = (dto.founderLinkedIn || dto.linkedin || '').trim()
    const organization = (dto.organization || dto.startupName || '').trim()

    const application = await this.prisma.fundingConclaveApplication.create({
      data: {
        applicationId,
        email,
        founderName,
        phone: dto.phone.trim(),
        founderLinkedIn,
        organization,
        motive: dto.motive.trim(),
        role: dto.role.trim(),
        passTier: dto.passTier,
        passTierName: dto.passTierName.trim(),
        passPrice: dto.passPrice.trim(),
        stage: (dto.stage ?? 'Early Stage').trim(),
        sector: (dto.sector ?? 'Technology / General').trim(),
        revenueStage: (dto.revenueStage ?? 'Pre-revenue').trim(),
        totalFundingRaised: (dto.totalFundingRaised ?? '0').trim(),
        currentAsk: (dto.currentAsk ?? 'N/A').trim(),
        pitchDeckUrl: dto.pitchDeckUrl?.trim(),
        mouComfortable: dto.mouComfortable.trim(),
        userId: dto.userId,
        status: 'PENDING_REVIEW',
      },
    })

    // Mirror as a FOUNDER_PITCH registration so it appears in the admin delegate list.
    try {
      await this.registrations.createRegistration({
        name: founderName,
        email,
        phone: dto.phone.trim(),
        college: organization,
        passType: PassType.FOUNDER_PITCH,
        tracks: [
          `Startup: ${organization}`,
          `Package: ${dto.passTierName} (${dto.passTier.toUpperCase()})`,
          `Role: ${dto.role.trim()}`,
          `Motive: ${dto.motive.trim()}`,
          `LinkedIn: ${founderLinkedIn}`,
        ].filter(Boolean),
      })
    } catch (err: any) {
      // Duplicate registration (already has a FOUNDER_PITCH pass) — not fatal.
      this.logger.warn(
        `Funding conclave registration mirror skipped for ${email}: ${err?.message}`,
      )
    }

    this.logger.log(
      `Funding conclave application ${applicationId} created for ${email} [${dto.passTier}]`,
    )

    return {
      success: true,
      applicationId: application.applicationId,
      passTierName: application.passTierName,
      message:
        'Application submitted successfully! Our team will review your details and send an MoU.',
    }
  }

  /** Retrieve all applications for a given email or userId. */
  async getApplicationsByEmail(email: string) {
    const normalised = email.trim().toLowerCase()
    return this.prisma.fundingConclaveApplication.findMany({
      where: { email: normalised },
      orderBy: { createdAt: 'desc' },
    })
  }
}
