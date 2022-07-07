import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ScheduleTaskService } from '../schedule-tasks/scheduleTask.service';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, ScheduleTaskService],
  exports: [TaskService],
})
export class TaskModule {}
