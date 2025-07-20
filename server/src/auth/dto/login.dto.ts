import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../generated/prisma';

export class LoginUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
}