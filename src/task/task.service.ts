import { Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/taskDto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async getAllTasks(): Promise<Task[]> {
    return await this.prisma.task.findMany();
  }

  async getOneTask(id: number): Promise<Task> {
    return await this.prisma.task.findUnique({
      where: {
        id,
      },
    });
  }

  async createTask(dto: CreateTaskDto): Promise<CreateTaskDto> {
    return await this.prisma.task.create({ data: dto });
  }
}
