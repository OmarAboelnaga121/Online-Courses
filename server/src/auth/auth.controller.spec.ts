import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      resetPassword: jest.fn(),
      updatePassword: jest.fn(),
    };

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

    describe('registerStudent', () => {
    it('should call AuthService.registerStudent with correct data and return its result', async () => {
        const dto: RegisterUserDto = {
            name: 'Test Student',
            username: 'teststudent',
            avatarUrl: 'http://example.com/avatar.png',
            email: 'test@example.com',
            password: 'Password123!',
            role: 'student',
        };
      const expectedResult = { id: 1, ...dto };
      (authService.register as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.registerStudent(dto);
      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should call AuthService.login with correct data and return its result', async () => {
      const loginDto = { email: 'test@example.com', password: 'Password123!' };
      const expectedResult = { user: { id: 1, email: 'test@example.com' }, access_token: 'jwt.token' };
      (authService.login as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('forgotPassword', () => {
    it('should call AuthService.resetPassword with correct email and return success message', async () => {
      (authService.resetPassword as jest.Mock).mockResolvedValue(undefined);
      const body = { email: 'test@example.com' };
      const result = await controller.forgotPassword(body);
      expect(authService.resetPassword).toHaveBeenCalledWith(body.email);
      expect(result).toEqual({ message: 'Password reset email sent.' });
    });
  });

  describe('resetPassword', () => {
    it('should call AuthService.updatePassword with correct token and newPassword and return success message', async () => {
      (authService.updatePassword as jest.Mock).mockResolvedValue(undefined);
      const body = { token: '123456', newPassword: 'NewPassword123!' };
      const result = await controller.resetPassword(body);
      expect(authService.updatePassword).toHaveBeenCalledWith(body.token, body.newPassword);
      expect(result).toEqual({ message: 'Password has been reset.' });
    });
  });
}); 