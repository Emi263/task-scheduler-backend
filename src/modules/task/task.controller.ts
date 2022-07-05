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
import { Task, User } from '@prisma/client';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { CreateTaskDto, UpdateTaskDto } from './dto/taskDto';
import { TaskService } from './task.service';
import { diskStorage } from 'multer';
import { randomBytes } from 'node:crypto';
import { parse } from 'node:path';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}
  @Get()
  async getTasks(@GetUser() user: any): Promise<Task[]> {
    return await this.taskService.getAllTasks(user);
  }

  @Get('top-tasks')
  async getTopTasks(@GetUser() user: any): Promise<Task[]> {
    return await this.taskService.getTopTasks(user);
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

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profileImage',
        filename: (req, file, cb) => {
          const filename =
            parse(file.originalname).name.replace(/\s/g, '') +
            randomBytes(64).toString('hex');
          const ext = parse(file.originalname).ext;

          cb(null, `${filename}${ext}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file) {
    return this.taskService.uploadImage(file);
  }
}
