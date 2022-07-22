import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, Prisma, Task, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/taskDto';
import * as fs from 'node:fs';
import { ScheduleTaskService } from '../schedule-tasks/scheduleTask.service';
import {
  fillEmptyDays,
  getLastWeeksDate,
  prevAndFutureDates,
  sameDay,
} from './helper';

export interface SeriesObject {
  day: string;
  number_of_tasks: number;
}
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
      orderBy: {
        date: 'asc',
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
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const tasks = await this.prisma.task.findMany({
      where: {
        userId: user.id,
        date: {
          gte: currentDate,
        },
      },
      orderBy: {
        date: 'desc',
      },

      take: 3,
    });

    return tasks;
  }

  async getTodayTasks(user: any): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        date: 'desc',
      },
    });

    const todayTasks = tasks.filter((task) => sameDay(task.date));

    return todayTasks;
  }

  async getLastWeekTasks(user: any) {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId: user.id,
        date: {
          gte: getLastWeeksDate(),
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return tasks;
  }
  async getTaskGraphValues(user: any): Promise<SeriesObject[]> {
    const { twoDaysAgo, afterTwoDays } = prevAndFutureDates();
    const tasks = await this.prisma.task.findMany({
      where: {
        userId: user.id,
        date: {
          gte: twoDaysAgo,
          lte: afterTwoDays,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    const result: SeriesObject[] = await this.prisma
      .$queryRaw`SELECT DATE_TRUNC ('day', date) AS day, COUNT(id) AS number_of_tasks FROM tasks 
      WHERE "userId" =${user.id} AND (date BETWEEN ${twoDaysAgo} AND ${afterTwoDays}) GROUP BY DATE_TRUNC('day', date);`;
    const finalResult = fillEmptyDays(result);
    return finalResult;
  }

  async createTask(dto: CreateTaskDto): Promise<Task> {
    try {
      const task = await this.prisma.task.create({ data: dto });
      const user = await this.prisma.user.findUnique({
        where: {
          id: dto.userId,
        },
      });

      const token = user.expoToken;
      if (task.shouldNotify) {
        await this.scheduleTaskService.addTaskCronJob(
          task.title + task.id,
          task.date.toISOString(),
          task,
          token,
        );
      }
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
    const deletedTask = await this.prisma.task.delete({
      where: {
        id,
      },
    });

    if (!deletedTask) {
      throw new NotFoundException();
    }

    const jobName = deletedTask.title + deletedTask.id;

    const jobExists = await this.scheduleTaskService.getJob(jobName);

    if (jobExists) {
      await this.scheduleTaskService.deleteCronJob(jobName);
    }

    return deletedTask;
  }
  async updateTask(id: number, body: UpdateTaskDto, user: Partial<User>) {
    const updatedTask = await this.prisma.task.update({
      where: {
        id,
      },
      data: body,
    });

    const prevTask = await this.getOneTask(id);
    const name = prevTask.title + prevTask.id;
    const jobExists = await this.scheduleTaskService.getJob(name);
    if (jobExists) {
      await this.scheduleTaskService.deleteCronJob(name);
    }
    const currentUser = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (updatedTask.shouldNotify) {
      await this.scheduleTaskService.addTaskCronJob(
        updatedTask.title + updatedTask.id,
        updatedTask.date.toISOString(),
        updatedTask,
        currentUser.expoToken,
      );
    }

    return updatedTask;
  }
}
