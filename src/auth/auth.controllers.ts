import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto,AuthSignupDto } from './dto';


@Controller('auth') //anotate the class so nest js knows it is a controller
export class AuthController {
  constructor(private authService: AuthService) {} //auth service is instantiated, private=>this.authSerice=auth service.

  @Post('signup')
  async signup(@Body() dto: AuthSignupDto) {
    const user = await this.authService.signUp(dto);
    return user;
  }

  @Post('login')
  async login(@Body() dto: AuthLoginDto) {

   const user = await this.authService.login(dto);
    return user;
  }

@Get('google/auth')
async googleAuth() {


}


}

//no need to worry to send the right data type, nest js will do that for us. can be text/html or json
