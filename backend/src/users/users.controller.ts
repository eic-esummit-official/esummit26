import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
  Query,
} from '@nestjs/common'
import { Public } from '../common/decorators/public.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  /**
   * GET /api/v1/users/profile?email=<addr>
   * Public — returns the stored profile for a given email address.
   * Used by the frontend onboarding flow for unauthenticated visitors.
   */
  @Public()
  @Get('profile')
  async getProfile(@Query('email') email?: string, @CurrentUser('id') userId?: string) {
    const profile = await this.users.getProfile({ userId, email })
    if (!profile) {
      return { success: true, profile: null }
    }
    return { success: true, profile }
  }

  /**
   * PATCH /api/v1/users/profile
   * Authenticated users update their own profile.
   * Unauthenticated callers must supply ?email= and are limited to non-sensitive fields.
   */
  @Public()
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Body() dto: UpdateProfileDto,
    @Query('email') email?: string,
    @CurrentUser('id') userId?: string,
  ) {
    if (userId) {
      // Authenticated — update by DB id.
      const profile = await this.users.updateProfile(userId, dto)
      return { success: true, profile }
    }

    if (email) {
      // Guest / unauthenticated — upsert by email (no password touched).
      const profile = await this.users.upsertByEmail(email, dto)
      return { success: true, profile }
    }

    throw new NotFoundException('Provide an Authorization header or ?email= query parameter')
  }
}
