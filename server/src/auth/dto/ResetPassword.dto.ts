import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Reset token sent to the user' })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({ description: 'New password for the user' })
  @IsNotEmpty()
  @IsStrongPassword()
  newPassword: string;
}
