import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({})
export class UserService {
  constructor(private Prisma: PrismaService) {}

 async getCurrentUser(id: number) {
    const user= await this.Prisma.user.findUnique({
      where: {
        id: id,
        
      },
      
    });

    delete user.hashedPassword;
    return user
  }
}
