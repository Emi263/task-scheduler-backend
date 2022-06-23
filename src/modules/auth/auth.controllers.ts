import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLoginDto, AuthSignupDto } from './dto';

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
    const user = await this.authService.login(userData);
    return user;
  }
}

//no need to worry to send the right data type, nest js will do that for us. can be text/html or json
