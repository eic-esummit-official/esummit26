import { Module } from '@nestjs/common'
import { FundingConclaveController } from './funding-conclave.controller'
import { FundingConclaveService } from './funding-conclave.service'
import { RegistrationsModule } from '../registrations/registrations.module'

@Module({
  imports: [RegistrationsModule],
  controllers: [FundingConclaveController],
  providers: [FundingConclaveService],
})
export class FundingConclaveModule {}
