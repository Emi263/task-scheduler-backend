import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/taskDto';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}
  @Get()
  async getTasks(): Promise<Task[]> {
    return await this.taskService.getAllTasks();
  }

  @Get(':id')
  async getTask(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.taskService.getOneTask(id);
  }

  @Post('create')
  async createTask(@Body() dto: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(dto);
  }
}
