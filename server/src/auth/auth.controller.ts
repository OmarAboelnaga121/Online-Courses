import { Controller, Post, Body } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login.dto';

// Add DTOs for forgot and reset password
class ForgotPasswordDto {
  email: string;
}
class ResetPasswordDto {
  token: string;
  newPassword: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new student' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ status: 201, description: 'Student registered successfully.' })
  @ApiResponse({ status: 400, description: 'Validation or registration error.' })
  async registerStudent(@Body() registerData: RegisterUserDto) {
    return this.authService.register(registerData);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 201, description: 'User logged in successfully, returns JWT token and user data.' })
  @ApiResponse({ status: 400, description: 'Invalid email or password.' })
  async login(@Body() loginData: LoginUserDto) {
    return this.authService.login(loginData);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset email sent.' })
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    await this.authService.resetPassword(body.email);
    return { message: 'Password reset email sent.' };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password has been reset.' })
  async resetPassword(@Body() body: ResetPasswordDto) {
    await this.authService.updatePassword(body.token, body.newPassword);
    return { message: 'Password has been reset.' };
  }
}
