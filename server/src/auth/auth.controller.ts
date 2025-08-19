import { Controller, Post, Body, UseGuards, Req, Get, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { Response } from 'express';
import { RegisterUserDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, getSchemaPath, ApiConsumes } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ForgotPasswordDto, ResetPasswordDto } from './dto';

@ApiTags('Auth')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
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
  async login(@Body() loginData: LoginUserDto, @Res({ passthrough: true }) res: Response,) {
    const result = await this.authService.login(loginData);

    // store token in cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true on production (https)
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return { user: result.user }; 
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

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logged out successfully.' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }
}
