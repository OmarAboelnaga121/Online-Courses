import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  RegisterUserDto,
  LoginUserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto';
import { BadRequestException } from '@nestjs/common';

const TEST_PASSWORD = 'testPassword123';
const TEST_NEW_PASSWORD = 'newTestPassword123';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    resetPassword: jest.fn(),
    updatePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerStudent', () => {
    const mockRegisterData: RegisterUserDto = {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: TEST_PASSWORD,
      role: 'student',
    };

    const mockPhoto = {
      fieldname: 'photo',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test'),
      size: 1024,
    } as Express.Multer.File;

    const mockUserResponse = {
      id: 'user-123',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      avatarUrl: 'https://example.com/avatar.jpg',
      role: 'student',
    };

    it('should register a new student successfully', async () => {
      mockAuthService.register.mockResolvedValue(mockUserResponse);

      const result = await controller.registerStudent(
        mockRegisterData,
        mockPhoto,
      );

      expect(authService.register).toHaveBeenCalledWith(
        mockRegisterData,
        mockPhoto,
      );
      expect(result).toEqual(mockUserResponse);
    });

    it('should throw BadRequestException when registration fails', async () => {
      const errorMessage = 'Username is already taken';
      mockAuthService.register.mockRejectedValue(
        new BadRequestException(errorMessage),
      );

      await expect(
        controller.registerStudent(mockRegisterData, mockPhoto),
      ).rejects.toThrow(BadRequestException);

      expect(authService.register).toHaveBeenCalledWith(
        mockRegisterData,
        mockPhoto,
      );
    });
  });

  describe('login', () => {
    const mockLoginData: LoginUserDto = {
      email: 'john@example.com',
      password: TEST_PASSWORD,
    };

    const mockLoginResponse = {
      user: {
        id: 'user-123',
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        avatarUrl: 'https://example.com/avatar.jpg',
        role: 'student',
      },
      access_token: 'jwt-token-123',
    };

    const mockResponse = {
      cookie: jest.fn(),
    } as any;

    it('should login user successfully', async () => {
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(mockLoginData, mockResponse);

      expect(authService.login).toHaveBeenCalledWith(mockLoginData);
      expect(result).toEqual({ user: mockLoginResponse.user });
      expect(mockResponse.cookie).toHaveBeenCalled();
    });

    it('should throw BadRequestException when login fails', async () => {
      const errorMessage = 'Invalid email or password';
      mockAuthService.login.mockRejectedValue(
        new BadRequestException(errorMessage),
      );

      await expect(
        controller.login(mockLoginData, mockResponse),
      ).rejects.toThrow(BadRequestException);

      expect(authService.login).toHaveBeenCalledWith(mockLoginData);
    });
  });

  describe('forgotPassword', () => {
    const mockForgotPasswordData: ForgotPasswordDto = {
      email: 'john@example.com',
    };

    it('should send password reset email successfully', async () => {
      mockAuthService.resetPassword.mockResolvedValue(undefined);

      const result = await controller.forgotPassword(mockForgotPasswordData);

      expect(authService.resetPassword).toHaveBeenCalledWith(
        mockForgotPasswordData.email,
      );
      expect(result).toEqual({ message: 'Password reset email sent.' });
    });

    it('should throw BadRequestException when password reset fails', async () => {
      const errorMessage = 'User not found';
      mockAuthService.resetPassword.mockRejectedValue(
        new BadRequestException(errorMessage),
      );

      await expect(
        controller.forgotPassword(mockForgotPasswordData),
      ).rejects.toThrow(BadRequestException);

      expect(authService.resetPassword).toHaveBeenCalledWith(
        mockForgotPasswordData.email,
      );
    });
  });

  describe('resetPassword', () => {
    const mockResetPasswordData: ResetPasswordDto = {
      token: 'reset-token-123',
      newPassword: TEST_NEW_PASSWORD,
    };

    it('should reset password successfully', async () => {
      mockAuthService.updatePassword.mockResolvedValue(undefined);

      const result = await controller.resetPassword(mockResetPasswordData);

      expect(authService.updatePassword).toHaveBeenCalledWith(
        mockResetPasswordData.token,
        mockResetPasswordData.newPassword,
      );
      expect(result).toEqual({ message: 'Password has been reset.' });
    });

    it('should throw BadRequestException when password reset fails', async () => {
      const errorMessage = 'Invalid or expired token';
      mockAuthService.updatePassword.mockRejectedValue(
        new BadRequestException(errorMessage),
      );

      await expect(
        controller.resetPassword(mockResetPasswordData),
      ).rejects.toThrow(BadRequestException);

      expect(authService.updatePassword).toHaveBeenCalledWith(
        mockResetPasswordData.token,
        mockResetPasswordData.newPassword,
      );
    });
  });
});
