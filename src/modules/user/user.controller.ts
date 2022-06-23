import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ForgotPasswordDto } from './user.dto';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '@prisma/client';

@UseGuards(JwtAuthGuard) //applies the guard to user controller
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  getUsers(@GetUser() user: Partial<User>) {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getCurrentUser(id);
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPassDto: ForgotPasswordDto) {}
}
