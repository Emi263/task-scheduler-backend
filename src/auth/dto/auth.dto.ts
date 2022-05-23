import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class AuthSignupDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @MinLength(5, { message: 'Name is too short' })
  @IsString()
  name: string;

  @IsNotEmpty()
  @MinLength(5, { message: 'Surname is too short' })
  @IsString()
  surname: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsInt()
  @IsNotEmpty()
  age: number;
}
