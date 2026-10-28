import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator'

export class TeamMemberDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string

  @IsEmail()
  email: string

  @IsBoolean()
  isLeader: boolean
}

export class AnswerDto {
  @IsString()
  @IsNotEmpty()
  questionId: string

  @IsString()
  @IsNotEmpty()
  selectedOption: string
}

/** Used at the start — validates team details BEFORE the test begins. */
export class ValidateTeamDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  teamName: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  college: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  leaderPhone: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberDto)
  members: TeamMemberDto[]
}

/** Used at the end — submits answers only (team details already validated). */
export class SubmitTestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  teamName: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  college: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  leaderPhone: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberDto)
  members: TeamMemberDto[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[]

  @IsInt()
  @Min(0)
  @IsOptional()
  violations?: number
}
