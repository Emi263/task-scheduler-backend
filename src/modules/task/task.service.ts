import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, Prisma, Task } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/taskDto';
import * as fs from 'node:fs';
import { ScheduleTaskService } from '../schedule-tasks/scheduleTask.service';
import { sameDay } from './helper';

interface SeriesObject {
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
    console.log(tasks);

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
      if (task.shouldNotify) {
        await this.scheduleTaskService.addTaskCronJob(
          task.title + task.id,
          task.date.toISOString(),
          task,
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
  async updateTask(id: number, body: UpdateTaskDto) {
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

    if (updatedTask.shouldNotify) {
      await this.scheduleTaskService.addTaskCronJob(
        updatedTask.title + updatedTask.id,
        updatedTask.date.toISOString(),
        updatedTask,
      );
    }

    return updatedTask;
  }

  //works only in postman. Not implemented in FrontEnd
  uploadImage(file: any): string {
    const path = file.path;
    const image = fs.readFileSync(path, 'base64');
    //save it to prisma
    const fullImage = 'data:image/gif;base64,' + image;
    fs.rmSync(path);
    return fullImage;
  }
}

//helpers => MAY BE EXTRACTED TO A SPECIFIC FILE

const prevAndFutureDates = () => {
  const twoDaysAgo = new Date();
  const afterTwoDays = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  twoDaysAgo.setHours(0, 0, 0, 0);

  afterTwoDays.setDate(afterTwoDays.getDate() + 2);
  afterTwoDays.setHours(24, 0, 0, 0);

  return {
    twoDaysAgo,
    afterTwoDays,
  };
};

const fillEmptyDays = (result: SeriesObject[]) => {
  const { twoDaysAgo, afterTwoDays } = prevAndFutureDates();
  const map = new Map();

  const today = new Date();

  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  //dates we are interested in
  const dates = [twoDaysAgo, yesterday, today, tomorrow, afterTwoDays];

  //populate the data by default values
  dates.forEach((date) => {
    return map.set(getDateString(date), {
      day: date,
      number_of_tasks: 0,
    });
  });

  //override the data based on result
  result.forEach((res) => {
    if (res.day) {
      return map.set(getDateString(new Date(res.day)), {
        day: new Date(res.day),
        number_of_tasks: res.number_of_tasks,
      });
    }

    return;
  });

  const finalArray: SeriesObject[] = dates.map((date) => {
    let item = map.get(getDateString(date));
    return item;
  });

  return finalArray;
};

const getDateString = (date: Date) => {
  return date.toISOString().split('T')[0];
};
