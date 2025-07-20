import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../generated/prisma';

export class RegisterUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  avatarUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({ enum: Role })
  @IsNotEmpty()
  @IsIn(['student', 'admin', 'instructor'])
  role: string;
}