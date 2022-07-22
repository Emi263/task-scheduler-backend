import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Task } from '@prisma/client';
import { CronJob } from 'cron';
import Expo from 'expo-server-sdk';
import { PrismaService } from '../prisma/prisma.service';

@Injectable({})
export class ScheduleTaskService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private Prisma: PrismaService,
  ) {}
  private readonly logger = new Logger();

  async addTaskCronJob(name: string, date: string, task: Task, token: string) {
    if (new Date(date) < new Date()) {
      throw new BadRequestException('Date is in the past');
    }

    console.log('Added', name);

    let expo = new Expo();
    let messages = [];

    const pushToken = token;
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      return;
    }
    messages.push({
      to: pushToken,
      sound: 'default',
      title: 'Upcoming task!',
      body: `Hello we are notifying you on your task: ${task.title} `,
      data: { ...task },
    });
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];

    const job = new CronJob(new Date(date), () => {
      console.log('Job added at: ', new Date(date).toLocaleString());

      (async () => {
        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
            tickets.push(...ticketChunk);
          } catch (error) {
            console.error(error);
          }
        }
      })();
    });
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  async deleteCronJob(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
    this.logger.debug(`Task with name : ${name} deleted!`);
  }

  async getJob(name: string): Promise<boolean> {
    try {
      const job = this.schedulerRegistry.getCronJob(name);
      if (job) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}
