import { Injectable } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/taskDto';
@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}
  async getAllTasks(user: any): Promise<Task[]> {
    return await this.prisma.task.findMany({
      where: {
        userId: user.id,
      },
    });
  }

  async getOneTask(id: number): Promise<Task> {
    return await this.prisma.task.findUnique({
      where: {
        id,
      },
    });
  }

  async getTopTasks(user: any): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        date: 'desc',
      },
      take: 4,
    });
    return tasks;
  }

  async createTask(dto: CreateTaskDto): Promise<Task> {
    try {
      return await this.prisma.task.create({ data: dto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e instanceof Prisma.PrismaClientKnownRequestError);
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          console.log(
            'There is a unique constraint violation, a new task cannot be created with this id',
          );
        }
      }
      throw e;
    }
  }

  async deleteTask(id: number) {
    const deletedTask = this.prisma.task.delete({
      where: {
        id,
      },
    });

    return deletedTask;
  }
  async updateTask(id: number, body: UpdateTaskDto) {
    const updatedTask = await this.prisma.task.update({
      where: {
        id,
      },
      data: body,
    });

    return updatedTask;
  }
}
