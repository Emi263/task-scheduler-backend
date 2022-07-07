import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Task } from '@prisma/client';
import { CronJob } from 'cron';
import Expo from 'expo-server-sdk';

@Injectable({})
export class ScheduleTaskService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}
  private readonly logger = new Logger();

  async addTaskCronJob(name: string, date: string, task: Task) {
    let expo = new Expo();
    let messages = [];
    const pushToken = 'ExponentPushToken[oaS65rMC4pwSeH5R1sNcXk]';
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      return;
    }
    messages.push({
      to: pushToken,
      sound: 'default',
      title: 'Upcomin task!',
      body: `Hello we are notifying you on your task: ${task.title} `,
      data: { ...task },
    });
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];

    const job = new CronJob(new Date(date), () => {
      console.log('Job added at: ', new Date(date).toLocaleDateString());

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
}
