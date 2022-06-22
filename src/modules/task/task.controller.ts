import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Task } from '@prisma/client';
import { CreateTaskDto, UpdateTaskDto } from './dto/taskDto';
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

  @Delete(':id')
  async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.taskService.deleteTask(id);
  }

  @Put(':id')
  async updateTask(
    @Body() body: UpdateTaskDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Task> {
    return this.taskService.updateTask(id, body);
  }

  @Post('')
  async createTask(@Body() dto: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(dto);
  }
}
