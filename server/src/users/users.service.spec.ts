jest.mock('../prismaClient', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    course: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { RedisService } from '../redis/redis.service';
import { BadRequestException } from '@nestjs/common';
import { UserDto } from '../auth/dto';
import { updateUserDto } from './dto/updateUser.dto';

const mockPrisma = require('../prismaClient').default;

describe('UsersService', () => {
  let service: UsersService;
  let cloudinaryService: CloudinaryService;
  let redisService: RedisService;

  const mockCloudinaryService = {
    uploadFile: jest.fn(),
  };

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  const mockUser: UserDto = {
    id: 'user-1',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    avatarUrl: 'http://avatar.jpg',
    role: 'student',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: CloudinaryService, useValue: mockCloudinaryService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
    redisService = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateUserProfile', () => {
    const mockUpdateData: updateUserDto = {
      name: 'John Updated',
      username: 'johnupdated',
    };

    const mockPhoto = {
      buffer: Buffer.from('photo'),
      originalname: 'photo.jpg',
    } as Express.Multer.File;

    it('should update user profile successfully', async () => {
      const mockUpdatedUser = {
        ...mockUser,
        name: mockUpdateData.name,
        username: mockUpdateData.username,
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockCloudinaryService.uploadFile.mockResolvedValue({
        url: 'http://new-avatar.jpg',
      });
      mockPrisma.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await service.updateUserProfile(
        mockUser,
        mockUpdateData,
        mockPhoto,
      );

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: mockUpdateData.username },
      });
      expect(mockCloudinaryService.uploadFile).toHaveBeenCalledWith(mockPhoto);
      expect(mockPrisma.user.update).toHaveBeenCalled();
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should update profile without photo', async () => {
      const mockUpdatedUser = {
        ...mockUser,
        name: mockUpdateData.name,
        username: mockUpdateData.username,
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await service.updateUserProfile(mockUser, mockUpdateData);

      expect(mockCloudinaryService.uploadFile).not.toHaveBeenCalled();
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should throw error if username is already taken', async () => {
      const existingUser = {
        id: 'other-user',
        username: mockUpdateData.username,
      };
      mockPrisma.user.findUnique.mockResolvedValue(existingUser);

      await expect(
        service.updateUserProfile(mockUser, mockUpdateData),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow same user to keep their username', async () => {
      const sameUser = { id: mockUser.id, username: mockUpdateData.username };
      mockPrisma.user.findUnique.mockResolvedValue(sameUser);
      mockPrisma.user.update.mockResolvedValue(mockUser);

      const result = await service.updateUserProfile(mockUser, mockUpdateData);

      expect(result).toBeDefined();
    });

    it('should throw error if photo upload fails', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockCloudinaryService.uploadFile.mockRejectedValue(
        new Error('Upload failed'),
      );

      await expect(
        service.updateUserProfile(mockUser, mockUpdateData, mockPhoto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should invalidate instructor cache for instructor users', async () => {
      const instructorUser = { ...mockUser, role: 'instructor' };
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.update.mockResolvedValue(instructorUser);

      await service.updateUserProfile(instructorUser as any, mockUpdateData);

      expect(mockRedisService.del).toHaveBeenCalledWith(
        `instructor:${instructorUser.id}`,
      );
    });
  });

  describe('getInstructorProfile', () => {
    const instructorId = 'instructor-1';

    it('should return cached instructor profile if available', async () => {
      const mockInstructor = {
        id: instructorId,
        name: 'Jane Instructor',
        role: 'instructor',
        myCourses: [],
      };

      mockRedisService.get.mockResolvedValue(JSON.stringify(mockInstructor));

      const result = await service.getInstructorProfile(instructorId);

      expect(mockRedisService.get).toHaveBeenCalledWith(
        `instructor:${instructorId}`,
      );
      expect(result).toEqual(mockInstructor);
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('should fetch from database and cache if not in cache', async () => {
      const mockInstructor = {
        id: instructorId,
        name: 'Jane Instructor',
        role: 'instructor',
        myCourses: [],
      };

      mockRedisService.get.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockResolvedValue(mockInstructor);

      const result = await service.getInstructorProfile(instructorId);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: instructorId },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          avatarUrl: true,
          role: true,
          myCourses: true,
        },
      });
      expect(mockRedisService.set).toHaveBeenCalledWith(
        `instructor:${instructorId}`,
        JSON.stringify(mockInstructor),
        900,
      );
      expect(result).toEqual(mockInstructor);
    });

    it('should throw error if instructor not found', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getInstructorProfile(instructorId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw error if user is not instructor', async () => {
      const mockStudent = {
        id: instructorId,
        name: 'John Student',
        role: 'student',
      };

      mockRedisService.get.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockResolvedValue(mockStudent);

      await expect(service.getInstructorProfile(instructorId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getComprehensiveUserProfile', () => {
    const userId = 'user-1';

    it('should return cached comprehensive profile if available', async () => {
      const mockProfile = {
        id: userId,
        name: 'John Doe',
        enrolledCourses: [],
        wishList: [],
        payments: [],
        statistics: {},
      };

      mockRedisService.get.mockResolvedValue(JSON.stringify(mockProfile));

      const result = await service.getComprehensiveUserProfile(userId);

      expect(mockRedisService.get).toHaveBeenCalledWith(
        `user:${userId}:comprehensive`,
      );
      expect(result).toEqual(mockProfile);
    });

    it('should fetch comprehensive data from database if not cached', async () => {
      const mockUser = {
        id: userId,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        avatarUrl: 'http://avatar.jpg',
        role: 'student',
        enrolledCourses: ['course-1'],
        wishList: ['course-2'],
        payments: [
          {
            id: 'payment-1',
            amount: 99.99,
            courseId: 'course-1',
            date: new Date(),
          },
        ],
        myCourses: [],
      };

      const mockEnrolledCourse = {
        id: 'course-1',
        title: 'Enrolled Course',
        instructor: { id: 'instructor-1', name: 'Jane' },
        lessons: [{ id: 'lesson-1', title: 'Lesson 1' }],
      };

      const mockWishlistCourse = {
        id: 'course-2',
        title: 'Wishlist Course',
        instructor: { id: 'instructor-2', name: 'Bob' },
      };

      const mockCourseForPayment = {
        id: 'course-1',
        title: 'Enrolled Course',
        instructor: { id: 'instructor-1', name: 'Jane' },
      };

      mockRedisService.get.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.course.findMany
        .mockResolvedValueOnce([mockEnrolledCourse])
        .mockResolvedValueOnce([mockWishlistCourse]);
      mockPrisma.course.findUnique.mockResolvedValue(mockCourseForPayment);

      const result = await service.getComprehensiveUserProfile(userId);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: {
          payments: { orderBy: { date: 'desc' } },
          myCourses: {
            include: {
              lessons: {
                select: { id: true, title: true },
              },
            },
          },
        },
      });

      expect(result).toHaveProperty('enrolledCourses');
      expect(result).toHaveProperty('wishList');
      expect(result).toHaveProperty('payments');
      expect(result).toHaveProperty('statistics');
      expect(result.statistics.totalSpent).toBe(99.99);
      expect(result.statistics.totalCoursesEnrolled).toBe(1);
    });

    it('should throw error if user not found', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getComprehensiveUserProfile(userId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should cache the comprehensive profile after fetching', async () => {
      const mockUser = {
        id: userId,
        name: 'John Doe',
        enrolledCourses: [],
        wishList: [],
        payments: [],
        myCourses: [],
      };

      mockRedisService.get.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.course.findMany.mockResolvedValue([]);

      await service.getComprehensiveUserProfile(userId);

      expect(mockRedisService.set).toHaveBeenCalledWith(
        `user:${userId}:comprehensive`,
        expect.any(String),
        600,
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return cached users if available', async () => {
      const mockUsers = [mockUser, { ...mockUser, id: 'user-2' }];
      mockRedisService.get.mockResolvedValue(JSON.stringify(mockUsers));

      const adminUser = { ...mockUser, role: 'admin' };
      const result = await service.getAllUsers(adminUser as any);

      expect(mockRedisService.get).toHaveBeenCalledWith('users');
      expect(result).toEqual(mockUsers);
      expect(mockPrisma.user.findMany).not.toHaveBeenCalled();
    });

    it('should fetch users from database and cache if not cached', async () => {
      const mockUsers = [mockUser, { ...mockUser, id: 'user-2' }];
      mockRedisService.get.mockResolvedValue(null);
      mockPrisma.user.findMany.mockResolvedValue(mockUsers);

      const adminUser = { ...mockUser, role: 'admin' };
      const result = await service.getAllUsers(adminUser as any);

      expect(mockPrisma.user.findMany).toHaveBeenCalled();
      expect(mockRedisService.set).toHaveBeenCalledWith(
        'users',
        JSON.stringify(mockUsers),
        600,
      );
      expect(result).toEqual(mockUsers);
    });

    it('should throw error if user is not admin', async () => {
      await expect(service.getAllUsers(mockUser)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockPrisma.user.findMany).not.toHaveBeenCalled();
    });
  });
});
