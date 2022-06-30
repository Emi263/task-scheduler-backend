import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Task } from '@prisma/client';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { CreateTaskDto, UpdateTaskDto } from './dto/taskDto';
import { TaskService } from './task.service';

@UseGuards(JwtAuthGuard)
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
  async createTask(
    @GetUser() user: any,
    @Body() dto: CreateTaskDto,
  ): Promise<Task> {
    return this.taskService.createTask({
      ...dto,
      userId: user.id,
    });
  }
}
