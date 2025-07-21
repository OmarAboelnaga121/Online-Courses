import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, getSchemaPath, ApiConsumes } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('photo'))
  @ApiOperation({ summary: 'Register a new student' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        role: { type: 'string', enum: ['student', 'admin', 'instructor'] },
        photo: { type: 'string', format: 'binary' },
      },
      required: ['name', 'username', 'email', 'password', 'role', 'photo'],
    },
  })
  @ApiResponse({ status: 201, description: 'Student registered successfully.' })
  @ApiResponse({ status: 400, description: 'Validation or registration error.' })
  async registerStudent(
    @Body() registerData: RegisterUserDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.authService.register(registerData, photo);
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
