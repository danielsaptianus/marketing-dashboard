import { Module } from '@nestjs/common';
import { MarketingMonitoringService } from './marketing-monitoring.service';
import { MarketingMonitoringController } from './controllers/v1/marketing-monitoring.controller';

@Module({
  controllers: [MarketingMonitoringController],
  providers: [MarketingMonitoringService],
  exports: [MarketingMonitoringService],
})
export class MarketingMonitoringModule {}
