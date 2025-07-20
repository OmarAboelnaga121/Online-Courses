import { Controller, Post, Body } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login.dto';

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
}
