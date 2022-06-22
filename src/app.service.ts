import { Injectable } from '@nestjs/common';
import { PrismaService } from './modules/prisma/prisma.service';
@Injectable()
export class AppService {
  constructor(private Prisma: PrismaService) {}

  getHello(): any {
    return this.Prisma.user.findMany({});
  }
}
