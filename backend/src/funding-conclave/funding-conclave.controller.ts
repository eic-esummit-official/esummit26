import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { Public } from '../common/decorators/public.decorator'
import { CreateFundingConclaveApplicationDto } from './dto/create-application.dto'
import { FundingConclaveService } from './funding-conclave.service'

@Controller('funding-conclave')
export class FundingConclaveController {
  constructor(private readonly service: FundingConclaveService) {}

  /**
   * POST /api/v1/funding-conclave/applications
   * Submit a startup / founder pass application.
   */
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('applications')
  @HttpCode(HttpStatus.CREATED)
  async apply(@Body() dto: CreateFundingConclaveApplicationDto) {
    return this.service.apply(dto)
  }

  /**
   * GET /api/v1/funding-conclave/applications?email=<addr>
   * Retrieve applications for a given email. Public — no sensitive data exposed.
   */
  @Public()
  @Get('applications')
  async getApplications(@Query('email') email?: string) {
    if (!email) {
      return { success: true, applications: [] }
    }
    const applications = await this.service.getApplicationsByEmail(email)
    return { success: true, applications }
  }
}
