import {
  isEmail,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  isString,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class AuthSignupDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(5, { message: 'Name is too short' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  age: string;

  @ApiProperty()
  @IsOptional()
  isGoogleSignIn: boolean;

  @ApiProperty()
  @IsOptional()
  shouldChangePassword: boolean;
}

export class GoogleLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class forgotPasswordDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;
}
