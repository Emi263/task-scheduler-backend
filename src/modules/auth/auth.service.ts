import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import * as bycrypt from 'bcrypt';
import { AuthLoginDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({}) //anotate, use dependency injection
export class AuthService {
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
    const passwordMatches = this.checkPassword(
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
}
