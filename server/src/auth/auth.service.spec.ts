jest.mock('../prismaClient', () => ({
  __esModule: true,
  default: {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

const mockPrisma = require('../prismaClient').default;
jest.mock('argon2');

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { BadRequestException } from '@nestjs/common';
import { RegisterUserDto, LoginUserDto } from './dto';
import * as argon2 from 'argon2';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let mailerService: MailerService;
  let cloudinaryService: CloudinaryService;

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockMailerService = {
    sendMail: jest.fn(),
  };

  const mockCloudinaryService = {
    uploadFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: MailerService, useValue: mockMailerService },
        { provide: CloudinaryService, useValue: mockCloudinaryService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    mailerService = module.get<MailerService>(MailerService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const mockRegisterData: RegisterUserDto = {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123',
      role: 'student',
    };

    const mockPhoto = {
      buffer: Buffer.from('test'),
      originalname: 'test.jpg',
    } as Express.Multer.File;

    it('should register a new user successfully', async () => {
      mockPrisma.user.findFirst.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      (argon2.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockCloudinaryService.uploadFile.mockResolvedValue({ secure_url: 'http://test.jpg' });
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-1',
        ...mockRegisterData,
        password: 'hashedPassword',
        avatarUrl: 'http://test.jpg',
      });

      const result = await service.register(mockRegisterData, mockPhoto);

      expect(mockPrisma.user.findFirst).toHaveBeenCalledTimes(2);
      expect(argon2.hash).toHaveBeenCalledWith(mockRegisterData.password);
      expect(mockCloudinaryService.uploadFile).toHaveBeenCalledWith(mockPhoto);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw error if username is taken', async () => {
      mockPrisma.user.findFirst.mockResolvedValueOnce({ id: 'existing-user' });

      await expect(service.register(mockRegisterData, mockPhoto))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw error if email is taken', async () => {
      mockPrisma.user.findFirst.mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 'existing-user' });

      await expect(service.register(mockRegisterData, mockPhoto))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw error if photo is not provided', async () => {
      await expect(service.register(mockRegisterData, undefined as any))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    const mockLoginData: LoginUserDto = {
      email: 'john@example.com',
      password: 'password123',
    };

    it('should login user successfully', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'john@example.com',
        password: 'hashedPassword',
        name: 'John Doe',
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('jwt-token');

      const result = await service.login(mockLoginData);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: mockLoginData.email } });
      expect(argon2.verify).toHaveBeenCalledWith(mockUser.password, mockLoginData.password);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('access_token');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw error if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login(mockLoginData))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw error if password is invalid', async () => {
      const mockUser = { id: 'user-1', email: 'john@example.com', password: 'hashedPassword' };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(service.login(mockLoginData))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('resetPassword', () => {
    const email = 'john@example.com';

    it('should send reset password email successfully', async () => {
      const mockUser = { id: 'user-1', name: 'John Doe', email };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue(mockUser);
      mockMailerService.sendMail.mockResolvedValue(true);

      await service.resetPassword(email);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(mockPrisma.user.update).toHaveBeenCalled();
      expect(mockMailerService.sendMail).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.resetPassword(email))
        .rejects.toThrow('User not found');
    });
  });

  describe('updatePassword', () => {
    const token = 'reset-token';
    const newPassword = 'newPassword123';

    it('should update password successfully', async () => {
      const mockUser = {
        id: 'user-1',
        resetPasswordToken: token,
        resetPasswordExpires: new Date(Date.now() + 3600000),
      };

      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      (argon2.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      mockPrisma.user.update.mockResolvedValue(mockUser);

      await service.updatePassword(token, newPassword);

      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({ where: { resetPasswordToken: token } });
      expect(argon2.hash).toHaveBeenCalledWith(newPassword);
      expect(mockPrisma.user.update).toHaveBeenCalled();
    });

    it('should throw error if token is invalid', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);

      await expect(service.updatePassword(token, newPassword))
        .rejects.toThrow('Invalid or expired token');
    });

    it('should throw error if token is expired', async () => {
      const mockUser = {
        id: 'user-1',
        resetPasswordToken: token,
        resetPasswordExpires: new Date(Date.now() - 3600000),
      };

      mockPrisma.user.findFirst.mockResolvedValue(mockUser);

      await expect(service.updatePassword(token, newPassword))
        .rejects.toThrow('Invalid or expired token');
    });
  });

  describe('generateJwtToken', () => {
    it('should generate JWT token successfully', async () => {
      const mockUser = { id: 'user-1', username: 'johndoe' };
      mockJwtService.signAsync.mockResolvedValue('jwt-token');

      const result = await service.generateJwtToken(mockUser as any);

      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        username: mockUser.username,
      });
      expect(result).toEqual({ access_token: 'jwt-token' });
    });
  });
});