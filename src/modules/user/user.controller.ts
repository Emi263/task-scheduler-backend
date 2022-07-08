import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { UpdateuserDto } from './user.dto';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @ApiBearerAuth('authorization')
  @UseGuards(JwtAuthGuard) //applies the guard to user controller
  @Get('')
  getUsers(@GetUser() user: Partial<User>) {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getCurrentUser(id);
  }

  @UseGuards(JwtAuthGuard) //applies the guard to user controller
  @Put('/change-profile-pic')
  async updateUser(@Body() userData: UpdateuserDto, @GetUser() user: any) {
    return this.userService.updateUser(user.id, userData);
  }
}
