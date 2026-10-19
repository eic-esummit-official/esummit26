import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateProfileDto } from './dto/update-profile.dto'

function validateAndNormalizePhone(phone?: string): string {
  if (!phone || !phone.trim()) {
    throw new BadRequestException('WhatsApp number is compulsory')
  }
  const digits = phone.replace(/\D/g, '')
  const normalized =
    digits.startsWith('91') && digits.length === 12
      ? digits.slice(2)
      : digits.startsWith('0') && digits.length === 11
      ? digits.slice(1)
      : digits

  if (normalized.length !== 10) {
    throw new BadRequestException('WhatsApp number must be a valid 10-digit mobile number')
  }
  return phone.trim()
}

/**
 * Owns all user-profile read / write operations.
 * Registration, auth tokens, and payments live in their own modules.
 */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetch a public profile by userId (authenticated path) or email
   * (guest / unauthed path). Returns null when the user does not exist.
   */
  async getProfile(params: { userId?: string; email?: string }) {
    const { userId, email } = params

    if (!userId && !email) {
      throw new NotFoundException('userId or email is required')
    }

    const selectFields = {
      id: true,
      name: true,
      email: true,
      phone: true,
      college: true,
      gradYear: true,
      city: true,
      state: true,
      district: true,
      role: true,
      referralCode: true,
      createdAt: true,
      registrations: {
        select: {
          id: true,
          passId: true,
          passType: true,
          amountPaid: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' as const },
      },
    }

    const user = userId
      ? await this.prisma.user.findUnique({
          where: { id: userId },
          select: selectFields,
        })
      : await this.prisma.user.findUnique({
          where: { email: email!.trim().toLowerCase() },
          select: selectFields,
        })

    return user ?? null
  }

  /**
   * Partial-update a user's profile fields.
   * Strips undefined values so unset keys are never overwritten with null.
   */
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // Build a patch object — only include fields that were actually sent.
    const patch: Record<string, unknown> = {}
    if (dto.name !== undefined) patch.name = dto.name.trim()
    if (dto.phone !== undefined) patch.phone = validateAndNormalizePhone(dto.phone)
    if (dto.college !== undefined) patch.college = dto.college.trim()
    if (dto.gradYear !== undefined) patch.gradYear = dto.gradYear.trim()
    if (dto.city !== undefined) patch.city = dto.city.trim()
    if (dto.state !== undefined) patch.state = dto.state.trim()
    if (dto.district !== undefined) patch.district = dto.district.trim()

    if (Object.keys(patch).length === 0) {
      // Nothing to update — return current profile unchanged.
      return this.getProfile({ userId })
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: patch,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        college: true,
        gradYear: true,
        city: true,
        state: true,
        district: true,
        role: true,
        referralCode: true,
        createdAt: true,
      },
    })

    return updated
  }

  /**
   * Upsert a user record by email (used by the guest / no-auth profile-save flow).
   * Never overwrites an existing passwordHash.
   */
  async upsertByEmail(email: string, dto: UpdateProfileDto) {
    const normalised = email.trim().toLowerCase()

    const patch: Record<string, unknown> = {}
    if (dto.name) patch.name = dto.name.trim()
    if (dto.phone) patch.phone = validateAndNormalizePhone(dto.phone)
    if (dto.college) patch.college = dto.college.trim()
    if (dto.gradYear) patch.gradYear = dto.gradYear.trim()
    if (dto.city) patch.city = dto.city.trim()
    if (dto.state) patch.state = dto.state.trim()
    if (dto.district) patch.district = dto.district.trim()

    const user = await this.prisma.user.upsert({
      where: { email: normalised },
      create: {
        email: normalised,
        name: (dto.name ?? normalised).trim(),
        ...patch,
        role: 'USER',
      },
      update: patch,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        college: true,
        gradYear: true,
        city: true,
        state: true,
        district: true,
        role: true,
        referralCode: true,
        createdAt: true,
      },
    })

    return user
  }
}
