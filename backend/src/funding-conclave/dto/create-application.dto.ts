import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator'
import { FundingConclavePassTier } from '@prisma/client'

export class CreateFundingConclaveApplicationDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  founderName: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9+\-\s()]{7,20}$/, { message: 'Phone number format is invalid' })
  phone: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  founderLinkedIn: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  organization: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  motive: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  role: string

  @IsNotEmpty()
  @IsEnum(FundingConclavePassTier, {
    message: 'passTier must be one of: silver, gold, diamond',
  })
  passTier: FundingConclavePassTier

  @IsNotEmpty()
  @IsString()
  passTierName: string

  @IsNotEmpty()
  @IsString()
  passPrice: string

  @IsOptional()
  @IsString()
  @MaxLength(80)
  stage?: string

  @IsOptional()
  @IsString()
  @MaxLength(80)
  sector?: string

  @IsOptional()
  @IsString()
  revenueStage?: string

  @IsOptional()
  @IsString()
  totalFundingRaised?: string

  @IsOptional()
  @IsString()
  currentAsk?: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  pitchDeckUrl?: string

  @IsNotEmpty()
  @IsString()
  mouComfortable: string

  @IsOptional()
  @IsString()
  userId?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string

  @IsOptional()
  @IsString()
  @MaxLength(300)
  linkedin?: string

  @IsOptional()
  @IsString()
  @MaxLength(150)
  startupName?: string

  @IsOptional()
  @IsString()
  status?: string
}

