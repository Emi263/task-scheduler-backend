import {
  IsBoolean,
  isBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @ApiProperty()
  @IsBoolean()
  shouldNotify: boolean;

  @ApiProperty()
  @IsString()
  image: string;
}

export class UpdateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  date: Date;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  shouldNotify: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  image: string;
}
