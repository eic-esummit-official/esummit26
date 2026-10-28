import { Module } from '@nestjs/common'
import { VentureXTestController } from './venturex-test.controller'
import { VentureXTestService } from './venturex-test.service'

@Module({
  controllers: [VentureXTestController],
  providers: [VentureXTestService],
})
export class VentureXTestModule {}
