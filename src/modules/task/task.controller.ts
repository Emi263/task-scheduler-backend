import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Task } from '@prisma/client';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { CreateTaskDto, UpdateTaskDto } from './dto/taskDto';
import { TaskService } from './task.service';
import { diskStorage } from 'multer';
import { randomBytes } from 'node:crypto';
import { parse } from 'node:path';
import { ApiProperty } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @ApiProperty({
    name: 'Get all tasks',
    description: 'Get all tasks for a user',
  })
  @Get()
  async getTasks(@GetUser() user: any): Promise<Task[]> {
    return await this.taskService.getAllTasks(user);
  }

  @ApiProperty({
    name: 'Get latest tasks',
    description: 'Get 3 latest tasks',
  })
  @Get('top-tasks')
  async getTopTasks(@GetUser() user: any): Promise<Task[]> {
    return await this.taskService.getTopTasks(user);
  }

  @ApiProperty({
    name: 'Get  today tasks',
    description: 'Get all the tasks scheduled for the current date',
  })
  @Get('task-today')
  async getTodayTasks(@GetUser() user: any): Promise<Task[]> {
    return await this.taskService.getTodayTasks(user);
  }

  @ApiProperty({
    description:
      'Returns the data for the graph, for the past 2 days, today and future 2 days',
    isArray: true,
  })
  @Get('task-graph-values')
  async getTaskGraphValues(
    @GetUser() user: any,
  ): Promise<{ day: string; number_of_tasks: number }[]> {
    return await this.taskService.getTaskGraphValues(user);
  }

  @ApiProperty({
    name: 'Get last week tasks',
    description: 'Returns the tasks created by the user in the last week',
  })
  @Get('tasks-last-week')
  async getLastWeekTasks(@GetUser() user: any): Promise<Task[]> {
    return await this.taskService.getLastWeekTasks(user);
  }

  @ApiProperty({
    description: 'Returns a specific task',
  })
  @Get(':id')
  async getTask(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.taskService.getOneTask(id);
  }

  @ApiProperty({
    description: 'Delete a single task',
  })
  @Delete(':id')
  async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.taskService.deleteTask(id);
  }

  @ApiProperty({
    description: 'Update a task',
  })
  @Put(':id')
  async updateTask(
    @Body() body: UpdateTaskDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Task> {
    return this.taskService.updateTask(id, body);
  }

  @ApiProperty({
    description: 'Create a task',
  })
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
