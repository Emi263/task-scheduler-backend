import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({})
export class UserService {
  constructor(private Prisma: PrismaService) {}

  async getCurrentUser(id: number) {
    const user: User = await this.Prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    delete user.hashedPassword;
    return user;
  }
}
