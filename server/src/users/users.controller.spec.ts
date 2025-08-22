import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserDto } from '../auth/dto';
import { updateUserDto } from './dto/updateUser.dto';
import { BadRequestException } from '@nestjs/common';

const MOCK_USER: UserDto = {
  id: 'user-123',
  name: 'John Doe',
  username: 'johndoe',
  email: 'john@example.com',
  avatarUrl: 'https://example.com/avatar.jpg',
  role: 'student',
};

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    getComprehensiveUserProfile: jest.fn(),
    getInstructorProfile: jest.fn(),
    updateUserProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    const mockComprehensiveProfile = {
      id: 'user-123',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      avatarUrl: 'https://example.com/avatar.jpg',
      role: 'student',
      enrolledCourses: [
        {
          id: 'course-1',
          title: 'Introduction to Programming',
          description: 'Learn the basics of programming',
          thumbnail: 'https://example.com/thumb1.jpg',
          price: 49.99,
          instructor: {
            id: 'instructor-1',
            name: 'Jane Smith',
            username: 'janesmith',
            avatarUrl: 'https://example.com/instructor.jpg',
          },
          lessons: [
            {
              id: 'lesson-1',
              title: 'Introduction to Variables',
            },
          ],
        },
      ],
      wishList: [
        {
          id: 'course-2',
          title: 'Advanced JavaScript',
          description: 'Master JavaScript concepts',
          thumbnail: 'https://example.com/thumb2.jpg',
          price: 79.99,
          instructor: {
            id: 'instructor-2',
            name: 'Bob Johnson',
            username: 'bobjohnson',
            avatarUrl: 'https://example.com/bob.jpg',
          },
        },
      ],
      payments: [
        {
          id: 'payment-1',
          amount: 49.99,
          date: new Date(),
          status: 'Pay',
          method: 'stripe',
          course: {
            id: 'course-1',
            title: 'Introduction to Programming',
            description: 'Learn the basics of programming',
            thumbnail: 'https://example.com/thumb1.jpg',
            price: 49.99,
            instructor: {
              id: 'instructor-1',
              name: 'Jane Smith',
              username: 'janesmith',
              avatarUrl: 'https://example.com/instructor.jpg',
            },
          },
        },
      ],
      myCourses: [],
      statistics: {
        totalSpent: 49.99,
        totalCoursesEnrolled: 1,
        totalWishlistItems: 1,
        totalCoursesCreated: 0,
        totalPayments: 1,
      },
    };

    it('should return comprehensive user profile', async () => {
      mockUsersService.getComprehensiveUserProfile.mockResolvedValue(mockComprehensiveProfile);

      const result = await controller.getProfile(MOCK_USER);

      expect(usersService.getComprehensiveUserProfile).toHaveBeenCalledWith(MOCK_USER.id);
      expect(result).toEqual(mockComprehensiveProfile);
    });

    it('should handle service errors', async () => {
      const errorMessage = 'User not found';
      mockUsersService.getComprehensiveUserProfile.mockRejectedValue(
        new BadRequestException(errorMessage)
      );

      await expect(controller.getProfile(MOCK_USER))
        .rejects
        .toThrow(BadRequestException);
      
      expect(usersService.getComprehensiveUserProfile).toHaveBeenCalledWith(MOCK_USER.id);
    });

    it('should return profile with instructor data for instructor users', async () => {
      const instructorUser: UserDto = {
        ...MOCK_USER,
        role: 'instructor',
      };

      const instructorProfile = {
        ...mockComprehensiveProfile,
        role: 'instructor',
        myCourses: [
          {
            id: 'course-3',
            title: 'My Course',
            description: 'Course I created',
            thumbnail: 'https://example.com/thumb3.jpg',
            price: 29.99,
            published: true,
            studentsEnrolled: ['student-1', 'student-2'],
            lessons: [
              {
                id: 'lesson-1',
                title: 'My Lesson',
              },
            ],
          },
        ],
        statistics: {
          ...mockComprehensiveProfile.statistics,
          totalCoursesCreated: 1,
        },
      };

      mockUsersService.getComprehensiveUserProfile.mockResolvedValue(instructorProfile);

      const result = await controller.getProfile(instructorUser);

      expect(usersService.getComprehensiveUserProfile).toHaveBeenCalledWith(instructorUser.id);
      expect(result).toEqual(instructorProfile);
      expect(result.myCourses).toHaveLength(1);
      expect(result.statistics.totalCoursesCreated).toBe(1);
    });
  });

  describe('getInstructorProfile', () => {
    const instructorId = 'instructor-123';
    const mockInstructorProfile = {
      id: instructorId,
      name: 'Jane Smith',
      username: 'janesmith',
      email: 'jane@example.com',
      avatarUrl: 'https://example.com/jane.jpg',
      role: 'instructor',
      myCourses: [
        {
          id: 'course-1',
          title: 'Introduction to Programming',
          description: 'Learn the basics of programming',
          thumbnail: 'https://example.com/thumb1.jpg',
          price: 49.99,
          published: true,
          studentsEnrolled: ['student-1', 'student-2'],
          lessons: [
            {
              id: 'lesson-1',
              title: 'Introduction to Variables',
            },
            {
              id: 'lesson-2',
              title: 'Understanding Loops',
            },
          ],
        },
        {
          id: 'course-2',
          title: 'Advanced JavaScript',
          description: 'Master JavaScript concepts',
          thumbnail: 'https://example.com/thumb2.jpg',
          price: 79.99,
          published: false,
          studentsEnrolled: [],
          lessons: [
            {
              id: 'lesson-3',
              title: 'ES6 Features',
            },
          ],
        },
      ],
    };

    it('should return instructor profile successfully', async () => {
      mockUsersService.getInstructorProfile.mockResolvedValue(mockInstructorProfile);

      const result = await controller.getInstructorProfile(instructorId);

      expect(usersService.getInstructorProfile).toHaveBeenCalledWith(instructorId);
      expect(result).toEqual(mockInstructorProfile);
    });

    it('should throw BadRequestException when instructor not found', async () => {
      mockUsersService.getInstructorProfile.mockRejectedValue(
        new BadRequestException('Instructor not found or invalid role')
      );

      await expect(controller.getInstructorProfile(instructorId))
        .rejects
        .toThrow(BadRequestException);
      
      expect(usersService.getInstructorProfile).toHaveBeenCalledWith(instructorId);
    });

    it('should throw BadRequestException when user is not an instructor', async () => {
      mockUsersService.getInstructorProfile.mockRejectedValue(
        new BadRequestException('Instructor not found or invalid role')
      );

      await expect(controller.getInstructorProfile('student-123'))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  describe('updateProfile', () => {
    const mockUpdateData: updateUserDto = {
      name: 'John Updated',
      username: 'johnupdated',
    };

    const mockPhoto = {
      fieldname: 'photo',
      originalname: 'new-avatar.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('new-avatar'),
      size: 2048,
    } as Express.Multer.File;

    const mockUpdatedProfile = {
      id: 'user-123',
      name: 'John Updated',
      username: 'johnupdated',
      email: 'john@example.com',
      avatarUrl: 'https://example.com/new-avatar.jpg',
      role: 'student',
      enrolledCourses: ['course-1'],
      wishList: ['course-2'],
    };

    it('should update user profile successfully', async () => {
      mockUsersService.updateUserProfile.mockResolvedValue(mockUpdatedProfile);

      const result = await controller.updateProfile(MOCK_USER, mockUpdateData, mockPhoto);

      expect(usersService.updateUserProfile).toHaveBeenCalledWith(
        MOCK_USER,
        mockUpdateData,
        mockPhoto
      );
      expect(result).toEqual(mockUpdatedProfile);
    });

    it('should update profile without photo', async () => {
      mockUsersService.updateUserProfile.mockResolvedValue(mockUpdatedProfile);

      const result = await controller.updateProfile(MOCK_USER, mockUpdateData, undefined);

      expect(usersService.updateUserProfile).toHaveBeenCalledWith(
        MOCK_USER,
        mockUpdateData,
        undefined
      );
      expect(result).toEqual(mockUpdatedProfile);
    });

    it('should throw BadRequestException when username is already taken', async () => {
      mockUsersService.updateUserProfile.mockRejectedValue(
        new BadRequestException('Username already taken')
      );

      await expect(controller.updateProfile(MOCK_USER, mockUpdateData, mockPhoto))
        .rejects
        .toThrow(BadRequestException);
      
      expect(usersService.updateUserProfile).toHaveBeenCalledWith(
        MOCK_USER,
        mockUpdateData,
        mockPhoto
      );
    });

    it('should throw BadRequestException when photo upload fails', async () => {
      mockUsersService.updateUserProfile.mockRejectedValue(
        new BadRequestException('Failed to upload photo')
      );

      await expect(controller.updateProfile(MOCK_USER, mockUpdateData, mockPhoto))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should handle partial updates', async () => {
      const partialUpdateData: updateUserDto = {
        name: 'John Updated',
      };

      const partialUpdatedProfile = {
        ...mockUpdatedProfile,
        username: 'johndoe', // Keep original username
      };

      mockUsersService.updateUserProfile.mockResolvedValue(partialUpdatedProfile);

      const result = await controller.updateProfile(MOCK_USER, partialUpdateData, undefined);

      expect(usersService.updateUserProfile).toHaveBeenCalledWith(
        MOCK_USER,
        partialUpdateData,
        undefined
      );
      expect(result).toEqual(partialUpdatedProfile);
      expect(result.username).toBe('johndoe'); // Original username preserved
    });
  });

  describe('controller initialization', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should have users service injected', () => {
      expect(usersService).toBeDefined();
    });
  });
});
