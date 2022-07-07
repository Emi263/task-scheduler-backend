import { Injectable } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/taskDto';
import * as fs from 'node:fs';
import { ScheduleTaskService } from '../schedule-tasks/scheduleTask.service';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private scheduleTaskService: ScheduleTaskService,
  ) {}
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
      const task = await this.prisma.task.create({ data: dto });

      await this.scheduleTaskService.addTaskCronJob(
        task.title + task.id,
        task.date.toISOString(),
        task,
      );
      return task;
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

  uploadImage(file: any): string {
    const path = file.path;
    const image = fs.readFileSync(path, 'base64');
    //save it to prisma
    const fullImage = 'data:image/gif;base64,' + image;
    fs.rmSync(path);
    return fullImage;
  }
}
