import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ForgotPasswordDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@Req() req: Request) {
    return req.user;
  }

  @Get('user/:id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getCurrentUser(id);
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPassDto: ForgotPasswordDto) {}
}
