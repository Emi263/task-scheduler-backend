import {
  Body,
  Controller,
  HttpCode,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { GetUser } from './decorator/get-user.decorator';
import {
  AuthLoginDto,
  AuthSignupDto,
  ChangePasswordDto,
  GoogleLoginDto,
} from './dto';

@Controller('auth') //anotate the class so nest js knows it is a controller
export class AuthController {
  constructor(private authService: AuthService) {} //auth service is instantiated, private=>this.authSerice=auth service.

  @Post('signup')
  async signup(@Body() dto: AuthSignupDto) {
    const user = await this.authService.signUp(dto);
    return user;
  }

  @Post('login')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async login(@Body() userData: AuthLoginDto) {
    const token = await this.authService.login(userData);
    return token;
  }

  @Post('google-auth')
  async authenticate(@Body() googleUserData: GoogleLoginDto) {
    const token = await this.authService.googleSignIn(googleUserData);
    return token;
  }

  @Post('forgot-password')
  @ApiOkResponse({
    status: 200,
  })
  async resetPassword(@Body() token: { token: string }) {
    return this.authService.resetPassword(token.token);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  @ApiOkResponse({
    status: 200,
  })
  async changePassword(
    @GetUser() user: Partial<User>,
    @Body() changePasswordBody: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user, changePasswordBody);
  }
}

//no need to worry to send the right data type, nest js will do that for us. can be text/html or json
