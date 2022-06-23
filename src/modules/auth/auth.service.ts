import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import * as bycrypt from 'bcrypt';
import { AuthLoginDto, ChangePasswordDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import sendEmail from 'src/commons/helpers/sendEmail';

@Injectable({}) //anotate, use dependency injection
export class AuthService {
  passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; //minimum 8 characters and at least one letter and 1 number

  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(userDto: AuthLoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: userDto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordMatches = await this.checkPassword(
      userDto.password,
      user.hashedPassword,
    );

    if (!passwordMatches) {
      //stop the code and throw an exception
      throw new UnauthorizedException('Credentials incorrect');
    }
    return this.signToken(user.id, user.email);
  }

  async checkPassword(password: string, hash: string): Promise<boolean> {
    return await bycrypt.compare(password, hash);
  }

  async signUp(userDto: AuthLoginDto) {
    //generate the password
    try {
      const hash = await bycrypt.hash(userDto.password, 10);
      //save user to the database
      const user = await this.prismaService.user.create({
        data: {
          email: userDto.email,
          hashedPassword: hash,
          name: '',
          age: 0,
        },
      });
      delete user.hashedPassword;
      return this.signToken(user.id, user.email);
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
      expiresIn: '10h',
    });

    return { token };
  }

  async resetPassword(token: string) {
    //decode the user

    const payload: any = this.jwt.decode(token);

    //find if user exists on db
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    //generate a new password to user

    // aksfldsjdf;sldfsdsg

    try {
      await sendEmail('aksfldsjdf;sldfsdsg');
    } catch (error) {
      throw error;
    }

    const user = await this.prismaService.user.update({
      where: {
        email: payload.email,
      },
      data: {
        hashedPassword: 'aksfldsjdf;sldfsdsg',
      },
    });

    //send an email to use with his new password

    //update the user with the new password
  }

  async changePassword(requser: any, body: ChangePasswordDto) {
    //get the user from the db

    const user = await this.prismaService.user.findUnique({
      where: {
        email: requser.email,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }

    const isCurrentPasswordValid = await this.checkPassword(
      body.currentPassword,
      user.hashedPassword,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Wrong current password');
    }

    if (!this.passwordPattern.test(body.password)) {
      throw new UnprocessableEntityException('Weak password');
    }

    const updatedUser = await this.prismaService.user.update({
      where: {
        email: requser.email,
      },
      data: {
        hashedPassword: await bycrypt.hash(body.password, 10),
      },
    });

    delete updatedUser.hashedPassword;

    return updatedUser;
  }
}
