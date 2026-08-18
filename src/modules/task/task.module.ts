import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './controllers/v1/task.controller';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
