import { ConflictException, Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { SubmitTestDto, ValidateTeamDto } from './dto/submit-test.dto'

// ─── Ground-truth answers (server-only, never reaches the client) ─────────────
// Question IDs match what the frontend Server Action sends.
// CSV columns: Answer is the correct answer text.

const ANSWER_KEY: Record<string, string> = {
  'q-1': 'A person who starts a new business and takes on its risks',
  'q-2': 'Minimum Viable Product',
  'q-3': 'A fundamental change in business model or strategy based on what the startup has learned',
  'q-4': '9 months',
  'q-5': 'Primary key',
  'q-6': 'LEFT JOIN',
  'q-7': 'HAVING',
  'q-8': '2NF',
  'q-9': '50',
  'q-10': '42',
  'q-11': '72',
  'q-12': '15 years',
  'q-13': '8 days',
  'q-14': 'Compilation',
  'q-15': 'Compile-time polymorphism',
  'q-16': 'The base-class method must be declared virtual',
  'q-17': 'Liskov Substitution Principle',
  'q-18': 'Stack',
  'q-19': 'O(log n)',
  'q-20': 'O(n^2)',
}

@Injectable()
export class VentureXTestService {
  private readonly logger = new Logger(VentureXTestService.name)

  constructor(private readonly prisma: PrismaService) {}

  /** Check if a phone number has already submitted — used for pre-validation. */
  async checkAlreadySubmitted(phone: string): Promise<{ alreadySubmitted: boolean }> {
    const normalised = phone.trim().replace(/\s+/g, '')
    const existing = await this.prisma.ventureXTestSubmission.findUnique({
      where: { leaderPhone: normalised },
      select: { id: true },
    })
    return { alreadySubmitted: !!existing }
  }

  /**
   * Full team validation — called BEFORE the test begins.
   * Validates all team details via class-validator (DTO) + checks phone uniqueness.
   * Returns { valid: true } or throws a descriptive ConflictException / BadRequest.
   */
  async validateTeam(dto: ValidateTeamDto) {
    const phone = dto.leaderPhone.trim().replace(/\s+/g, '')

    // Check duplicate phone
    const existing = await this.prisma.ventureXTestSubmission.findUnique({
      where: { leaderPhone: phone },
      select: { id: true },
    })
    if (existing) {
      throw new ConflictException(
        'This phone number has already been used to submit the test. Only one attempt is allowed per team.',
      )
    }

    // Ensure exactly one leader
    const leaders = dto.members.filter((m) => m.isLeader)
    if (leaders.length !== 1) {
      throw new ConflictException('Exactly one team member must be marked as Team Leader.')
    }

    this.logger.log(
      `Team validated — "${dto.teamName}" | phone: ${phone} | ${dto.members.length} members`,
    )

    return { valid: true, message: 'Team details validated successfully.' }
  }

  /** Score and persist a test submission. */
  async submit(dto: SubmitTestDto) {
    const phone = dto.leaderPhone.trim().replace(/\s+/g, '')

    // Idempotency guard — block re-attempts
    const existing = await this.prisma.ventureXTestSubmission.findUnique({
      where: { leaderPhone: phone },
      select: { id: true },
    })
    if (existing) {
      throw new ConflictException(
        'This team has already submitted the test. Only one attempt is allowed per team.',
      )
    }

    // Score server-side against ground-truth
    let score = 0
    const totalQuestions = Object.keys(ANSWER_KEY).length

    for (const answer of dto.answers) {
      const correct = ANSWER_KEY[answer.questionId]
      if (correct && answer.selectedOption === correct) {
        score++
      }
    }

    const submission = await this.prisma.ventureXTestSubmission.create({
      data: {
        teamName: dto.teamName.trim(),
        college: dto.college.trim(),
        leaderPhone: phone,
        members: dto.members as any,
        answers: dto.answers as any,
        score,
        totalQuestions,
        violations: dto.violations ?? 0,
      },
    })

    this.logger.log(
      `VentureX test submitted — team: "${dto.teamName}" | phone: ${phone} | score: ${score}/${totalQuestions} | violations: ${dto.violations ?? 0}`,
    )

    return {
      success: true,
      message: 'Your test has been submitted successfully! Results will be shared after evaluation.',
      submissionId: submission.id,
    }
  }
}
