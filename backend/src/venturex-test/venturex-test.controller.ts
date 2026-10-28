import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { Public } from '../common/decorators/public.decorator'
import { SubmitTestDto, ValidateTeamDto } from './dto/submit-test.dto'
import { VentureXTestService } from './venturex-test.service'

@Controller('venturex-test')
export class VentureXTestController {
  constructor(private readonly service: VentureXTestService) {}

  /**
   * GET /api/v1/venturex-test/check/:phone
   * Quick pre-flight check — returns whether a phone number has already submitted.
   */
  @Public()
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @Get('check/:phone')
  async checkPhone(@Param('phone') phone: string) {
    return this.service.checkAlreadySubmitted(phone)
  }

  /**
   * POST /api/v1/venturex-test/validate-team
   * Full team validation BEFORE the test begins.
   * Validates all fields via class-validator DTO + checks phone uniqueness.
   * Returns { valid: true } on success, or 400/409 with descriptive errors.
   */
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('validate-team')
  @HttpCode(HttpStatus.OK)
  async validateTeam(@Body() dto: ValidateTeamDto) {
    return this.service.validateTeam(dto)
  }

  /**
   * POST /api/v1/venturex-test/submit
   * Accept a team's test submission. Scores server-side, stores in MongoDB.
   * Throttled to 3 per minute to deter brute-force replays.
   */
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Post('submit')
  @HttpCode(HttpStatus.CREATED)
  async submit(@Body() dto: SubmitTestDto) {
    return this.service.submit(dto)
  }
}
