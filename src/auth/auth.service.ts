import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bycrypt from 'bcrypt';
import { AuthLoginDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable({}) //anotate, use despendency injection
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async login(dto: AuthLoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      //stop the code and throw an exception
      throw new ForbiddenException('Credentials incorrect');
    }

    const passwordMatches = await bycrypt.compare(
      dto.password,
      user.hashedPassword,
    );

    if (!passwordMatches) {
      throw new ForbiddenException('Incrorrect credentials');
    }

    return this.signToken(user.id, user.email);
  }

  async signUp(dto: AuthLoginDto) {
    //generate the password
    try {
      const hash = await bycrypt.hash(dto.password, 10);
      //save user to the database
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          hashedPassword: hash,
        },
      });
      delete user.hashedPassword;
      return user;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
    }
  }

  async signToken(userId: number, email: string): Promise<{ token: string }> {
    const data = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(data, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn:10000,
    });

    return { token };
  }
}
