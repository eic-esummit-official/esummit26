import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'Full name must be a string' })
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Full name cannot exceed 100 characters' })
  @Matches(/^[a-zA-Z\s.\-']+$/, {
    message: 'Full name can only contain letters, spaces, hyphens, and dots',
  })
  name?: string

  @IsOptional()
  @IsString({ message: 'WhatsApp number must be a string' })
  @Matches(/^(?:\+?91[\s\-]?)?0?(?:[0-9][\s\-]?){9}[0-9]$/, {
    message: 'WhatsApp number must be a valid 10-digit mobile number (e.g. 9876543210 or +91 9876543210)',
  })
  phone?: string

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string

  @IsOptional()
  @IsString({ message: 'College name must be a string' })
  @MinLength(2, { message: 'College name must be at least 2 characters long' })
  @MaxLength(150, { message: 'College name cannot exceed 150 characters' })
  college?: string

  @IsOptional()
  @IsString({ message: 'Graduation year must be a string' })
  @MaxLength(60, { message: 'Graduation year cannot exceed 60 characters' })
  gradYear?: string

  @IsOptional()
  @IsString({ message: 'City must be a string' })
  @MinLength(2, { message: 'City must be at least 2 characters long' })
  @MaxLength(60, { message: 'City cannot exceed 60 characters' })
  city?: string

  @IsOptional()
  @IsString({ message: 'State must be a string' })
  @MaxLength(60, { message: 'State cannot exceed 60 characters' })
  state?: string

  @IsOptional()
  @IsString({ message: 'District must be a string' })
  @MaxLength(60, { message: 'District cannot exceed 60 characters' })
  district?: string

  @IsOptional()
  @IsString({ message: 'Branch must be a string' })
  @MaxLength(80, { message: 'Branch cannot exceed 80 characters' })
  branch?: string

  @IsOptional()
  @IsBoolean({ message: 'onboardingCompleted must be a boolean' })
  onboardingCompleted?: boolean

  @IsOptional()
  @IsBoolean({ message: 'whatsappAlerts must be a boolean' })
  whatsappAlerts?: boolean

  @IsOptional()
  @IsBoolean({ message: 'emailAlerts must be a boolean' })
  emailAlerts?: boolean

  // Read-only server metadata fields: accepted and ignored to prevent forbidNonWhitelisted errors
  @IsOptional()
  id?: string

  @IsOptional()
  role?: string

  @IsOptional()
  referralCode?: string | null

  @IsOptional()
  createdAt?: string

  @IsOptional()
  updatedAt?: string

  @IsOptional()
  registrations?: unknown
}

