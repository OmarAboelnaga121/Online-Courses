jest.mock('../prismaClient', () => ({
  __esModule: true,
  default: {
    course: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    lesson: {
      findMany: jest.fn(),
      createMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    review: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { RedisService } from '../redis/redis.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { CourseDto, LessonDto } from './dto';
import { UserDto } from '../auth/dto';

const mockPrisma = require('../prismaClient').default;

describe('CoursesService', () => {
  let service: CoursesService;
  let cloudinaryService: CloudinaryService;
  let redisService: RedisService;

  const mockCloudinaryService = {
    uploadFile: jest.fn(),
    uploadVideoFile: jest.fn(),
  };

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    delByPattern: jest.fn(),
  };

  const mockUser: UserDto = {
    id: 'user-1',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    avatarUrl: 'http://avatar.jpg',
    role: 'instructor',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: CloudinaryService, useValue: mockCloudinaryService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
    redisService = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCourses', () => {
    it('should return cached courses if available', async () => {
      const mockCourses = [{ id: 'course-1', title: 'Test Course' }];
      mockRedisService.get.mockResolvedValue(JSON.stringify(mockCourses));

      const result = await service.getCourses();

      expect(mockRedisService.get).toHaveBeenCalledWith('courses:all');
      expect(result).toEqual(mockCourses);
      expect(mockPrisma.course.findMany).not.toHaveBeenCalled();
    });

    it('should fetch from database and cache if not in cache', async () => {
      const mockCourses = [{ id: 'course-1', title: 'Test Course' }];
      mockRedisService.get.mockResolvedValue(null);
      mockPrisma.course.findMany.mockResolvedValue(mockCourses);

      const result = await service.getCourses();

      expect(mockPrisma.course.findMany).toHaveBeenCalled();
      expect(mockRedisService.set).toHaveBeenCalledWith(
        'courses:all',
        JSON.stringify(mockCourses),
        300,
      );
      expect(result).toEqual(mockCourses);
    });
  });

  describe('createCourses', () => {
    const mockCourseData: CourseDto = {
      title: 'Test Course',
      description: 'Test Description',
      overView: 'Test Overview',
      whatYouWillLearn: 'Test Learning',
      language: 'English',
      price: 99.99,
      category: 'Programming',
    };

    const mockPhoto = {
      buffer: Buffer.from('test'),
      originalname: 'test.jpg',
    } as Express.Multer.File;

    it('should create course successfully', async () => {
      const mockCourse = { id: 'course-1', ...mockCourseData };
      mockCloudinaryService.uploadFile.mockResolvedValue({
        url: 'http://test.jpg',
      });
      mockPrisma.course.create.mockResolvedValue(mockCourse);

      const result = await service.createCourses(
        mockCourseData,
        mockPhoto,
        mockUser,
      );

      expect(mockCloudinaryService.uploadFile).toHaveBeenCalledWith(mockPhoto);
      expect(mockPrisma.course.create).toHaveBeenCalled();
      expect(result).toEqual(mockCourse);
    });

    it('should throw error if photo is not provided', async () => {
      await expect(
        service.createCourses(mockCourseData, undefined as any, mockUser),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error if user is not instructor', async () => {
      const studentUser = { ...mockUser, role: 'student' };

      await expect(
        service.createCourses(mockCourseData, mockPhoto, studentUser as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error if photo upload fails', async () => {
      mockCloudinaryService.uploadFile.mockResolvedValue(null);

      await expect(
        service.createCourses(mockCourseData, mockPhoto, mockUser),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getSingleCourse', () => {
    const courseId = 'course-1';

    it('should return cached course if available', async () => {
      const mockCourse = { id: courseId, title: 'Test Course' };
      mockRedisService.get.mockResolvedValue(JSON.stringify(mockCourse));

      const result = await service.getSingleCourse(courseId);

      expect(mockRedisService.get).toHaveBeenCalledWith(`course:${courseId}`);
      expect(result).toEqual(mockCourse);
    });

    it('should fetch from database and cache if not in cache', async () => {
      const mockCourse = { id: courseId, title: 'Test Course' };
      mockRedisService.get.mockResolvedValue(null);
      mockPrisma.course.findUnique.mockResolvedValue(mockCourse);

      const result = await service.getSingleCourse(courseId);

      expect(mockPrisma.course.findUnique).toHaveBeenCalledWith({
        where: { id: courseId },
      });
      expect(mockRedisService.set).toHaveBeenCalledWith(
        `course:${courseId}`,
        JSON.stringify(mockCourse),
        600,
      );
      expect(result).toEqual(mockCourse);
    });

    it('should throw error if course not found', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockPrisma.course.findUnique.mockResolvedValue(null);

      await expect(service.getSingleCourse(courseId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateCourseStatus', () => {
    const courseId = 'course-1';
    const published = true;
    const userId = 'admin-1';

    it('should update course status successfully', async () => {
      const mockCourse = { id: courseId, title: 'Test Course' };
      const mockAdmin = { id: userId, role: 'admin' };
      const mockUpdatedCourse = { ...mockCourse, published };

      mockPrisma.course.findUnique.mockResolvedValue(mockCourse);
      mockPrisma.user.findUnique.mockResolvedValue(mockAdmin);
      mockPrisma.course.update.mockResolvedValue(mockUpdatedCourse);

      const result = await service.updateCourseStatus(
        courseId,
        published,
        userId,
      );

      expect(mockPrisma.course.update).toHaveBeenCalledWith({
        where: { id: courseId },
        data: { published },
      });
      expect(result).toEqual(mockUpdatedCourse);
    });

    it('should throw error if course not found', async () => {
      mockPrisma.course.findUnique.mockResolvedValue(null);

      await expect(
        service.updateCourseStatus(courseId, published, userId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error if user is not admin', async () => {
      const mockCourse = { id: courseId, title: 'Test Course' };
      const mockUser = { id: userId, role: 'instructor' };

      mockPrisma.course.findUnique.mockResolvedValue(mockCourse);
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.updateCourseStatus(courseId, published, userId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('putLessons', () => {
    const courseId = 'course-1';
    const mockLessons: LessonDto[] = [
      { title: 'Lesson 1', videoUrl: '', courseId },
    ];
    const mockVideos = [
      {
        buffer: Buffer.from('video'),
        originalname: 'video1.mp4',
      } as Express.Multer.File,
    ];

    it('should upload lessons successfully', async () => {
      const mockCourse = { id: courseId, instructorId: mockUser.id };
      const mockUpdatedCourse = {
        id: courseId,
        lessons: [{ id: 'lesson-1', title: 'Lesson 1' }],
      };

      mockPrisma.course.findUnique.mockResolvedValue(mockCourse);
      mockCloudinaryService.uploadVideoFile.mockResolvedValue({
        url: 'http://video.mp4',
      });
      mockPrisma.lesson.createMany.mockResolvedValue({ count: 1 });
      mockPrisma.course.update.mockResolvedValue(mockUpdatedCourse);

      const result = await service.putLessons(
        courseId,
        mockLessons,
        mockVideos,
        mockUser,
      );

      expect(mockCloudinaryService.uploadVideoFile).toHaveBeenCalledWith(
        mockVideos[0],
      );
      expect(mockPrisma.lesson.createMany).toHaveBeenCalled();
      expect(result).toEqual(mockUpdatedCourse.lessons);
    });

    it('should throw error if course not found', async () => {
      mockPrisma.course.findUnique.mockResolvedValue(null);

      await expect(
        service.putLessons(courseId, mockLessons, mockVideos, mockUser),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error if user is not course instructor', async () => {
      const mockCourse = { id: courseId, instructorId: 'other-instructor' };
      mockPrisma.course.findUnique.mockResolvedValue(mockCourse);

      await expect(
        service.putLessons(courseId, mockLessons, mockVideos, mockUser),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error if lessons and videos count mismatch', async () => {
      const mockCourse = { id: courseId, instructorId: mockUser.id };
      mockPrisma.course.findUnique.mockResolvedValue(mockCourse);

      await expect(
        service.putLessons(courseId, mockLessons, [], mockUser),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('createCourseReview', () => {
    const courseId = 'course-1';
    const userId = 'student-1';
    const rating = 5;
    const comment = 'Great course!';

    it('should create review successfully', async () => {
      const mockCourse = { id: courseId, title: 'Test Course' };
      const mockStudent = { id: userId, role: 'student' };
      const mockReview = { id: 'review-1', courseId, userId, rating, comment };

      mockPrisma.course.findUnique.mockResolvedValue(mockCourse);
      mockPrisma.review.findFirst.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockResolvedValue(mockStudent);
      mockPrisma.review.create.mockResolvedValue(mockReview);

      const result = await service.createCourseReview(
        courseId,
        userId,
        rating,
        comment,
      );

      expect(mockPrisma.review.create).toHaveBeenCalled();
      expect(result).toEqual(mockReview);
    });

    it('should throw error if course not found', async () => {
      mockPrisma.course.findUnique.mockResolvedValue(null);

      await expect(
        service.createCourseReview(courseId, userId, rating, comment),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error if user already reviewed', async () => {
      const mockCourse = { id: courseId, title: 'Test Course' };
      const mockExistingReview = { id: 'review-1', courseId, userId };

      mockPrisma.course.findUnique.mockResolvedValue(mockCourse);
      mockPrisma.review.findFirst.mockResolvedValue(mockExistingReview);

      await expect(
        service.createCourseReview(courseId, userId, rating, comment),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error if user is not student', async () => {
      const mockCourse = { id: courseId, title: 'Test Course' };
      const mockInstructor = { id: userId, role: 'instructor' };

      mockPrisma.course.findUnique.mockResolvedValue(mockCourse);
      mockPrisma.review.findFirst.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockResolvedValue(mockInstructor);

      await expect(
        service.createCourseReview(courseId, userId, rating, comment),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getAllCourseReviews', () => {
    const instructorId = 'instructor-1';

    it('should return cached reviews if available', async () => {
      const mockReviews = [
        { id: 'review-1', courseId: 'course-1', rating: 5, comment: 'Great!' },
        { id: 'review-2', courseId: 'course-2', rating: 4, comment: 'Good!' },
      ];
      const mockInstructor = { id: instructorId, role: 'instructor' };
      mockPrisma.user.findUnique.mockResolvedValue(mockInstructor);
      mockRedisService.get.mockResolvedValue(JSON.stringify(mockReviews));

      const result = await service.getAllCourseReviews(instructorId);

      expect(mockRedisService.get).toHaveBeenCalledWith(
        `instructor:${instructorId}:reviews`,
      );
      expect(result).toEqual(mockReviews);
      expect(mockPrisma.course.findMany).not.toHaveBeenCalled();
    });

    it('should fetch reviews from database and cache if not in cache', async () => {
      const mockCourses = [
        { id: 'course-1', instructorId },
        { id: 'course-2', instructorId },
      ];
      const mockReviews1 = [
        { id: 'review-1', courseId: 'course-1', rating: 5, comment: 'Great!' },
      ];
      const mockReviews2 = [
        { id: 'review-2', courseId: 'course-2', rating: 4, comment: 'Good!' },
      ];
      const mockInstructor = { id: instructorId, role: 'instructor' };

      mockPrisma.user.findUnique.mockResolvedValue(mockInstructor);
      mockRedisService.get.mockResolvedValue(null);
      mockPrisma.course.findMany.mockResolvedValue(mockCourses);
      mockPrisma.review.findMany
        .mockResolvedValueOnce(mockReviews1)
        .mockResolvedValueOnce(mockReviews2);

      const result = await service.getAllCourseReviews(instructorId);

      expect(mockPrisma.course.findMany).toHaveBeenCalledWith({
        where: { instructorId },
      });
      expect(mockPrisma.review.findMany).toHaveBeenCalledTimes(2);
      expect(mockRedisService.set).toHaveBeenCalledWith(
        `instructor:${instructorId}:reviews`,
        JSON.stringify([...mockReviews1, ...mockReviews2]),
        600,
      );
      expect(result).toEqual([...mockReviews1, ...mockReviews2]);
    });

    it('should return empty array if instructor has no courses', async () => {
      const mockInstructor = { id: instructorId, role: 'instructor' };
      mockPrisma.user.findUnique.mockResolvedValue(mockInstructor);
      mockRedisService.get.mockResolvedValue(null);
      mockPrisma.course.findMany.mockResolvedValue([]);

      const result = await service.getAllCourseReviews(instructorId);

      expect(result).toEqual([]);
      expect(mockPrisma.review.findMany).not.toHaveBeenCalled();
    });
  });
});
