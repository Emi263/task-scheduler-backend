import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';

import { UpdateuserDto } from './user.dto';

@Injectable({})
export class UserService {
  constructor(private Prisma: PrismaService) {}

  async getCurrentUser(id: number) {
    const user: User = await this.Prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) throw new NotFoundException();
    delete user.hashedPassword;

    return user;
  }

  async getAllUsers() {
    const users = await this.Prisma.user.findMany({
      include: {
        tasks: true,
      },
    });
    users.forEach((user) => delete user.hashedPassword);
    return users;
  }

  async updateUser(id: number, data: UpdateuserDto) {
    const user = await this.Prisma.user.update({
      where: {
        id: id,
      },
      data: {
        ...data,
      },
    });
    delete user.hashedPassword;
    return user;
  }

  async updateExpoToken(user: Partial<User>, token: string): Promise<string> {
    const currentUser = await this.Prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (currentUser.expoToken === token) {
      return currentUser.expoToken;
    }

    const updatedUser = await this.Prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        expoToken: token,
      },
    });

    return updatedUser.expoToken;
  }
}
