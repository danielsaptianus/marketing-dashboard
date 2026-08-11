import { Module } from '@nestjs/common';
import { MasterService } from './master.service';
import { MasterController } from './controllers/v1/master.controller';

@Module({
  controllers: [MasterController],
  providers: [MasterService],
  exports: [MasterService],
})
export class MasterModule {}
