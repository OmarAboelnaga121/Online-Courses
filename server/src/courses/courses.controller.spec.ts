import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CourseDto, LessonDto } from './dto';
import { UserDto } from '../auth/dto';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

describe('CoursesController', () => {
  let controller: CoursesController;
  let coursesService: CoursesService;

  const mockCoursesService = {
    getCourses: jest.fn(),
    getPublishedCourses: jest.fn(),
    getSingleCourse: jest.fn(),
    getLessonsForCourse: jest.fn(),
    createCourses: jest.fn(),
    updateCourseStatus: jest.fn(),
    putLessons: jest.fn(),
    getCourseReviews: jest.fn(),
    createCourseReview: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        {
          provide: CoursesService,
          useValue: mockCoursesService,
        },
      ],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
    coursesService = module.get<CoursesService>(CoursesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCourses', () => {
    const mockCourses = [
      {
        id: 'course-1',
        title: 'Introduction to Programming',
        description: 'Learn the basics of programming',
        price: 49.99,
        thumbnail: 'https://example.com/thumb1.jpg',
        published: true,
      },
      {
        id: 'course-2',
        title: 'Advanced JavaScript',
        description: 'Master JavaScript concepts',
        price: 79.99,
        thumbnail: 'https://example.com/thumb2.jpg',
        published: false,
      },
    ];

    it('should return all courses', async () => {
      mockCoursesService.getCourses.mockResolvedValue(mockCourses);

      const result = await controller.getCourses();

      expect(coursesService.getCourses).toHaveBeenCalled();
      expect(result).toEqual(mockCourses);
    });

    it('should handle service errors', async () => {
      const errorMessage = 'Failed to fetch courses';
      mockCoursesService.getCourses.mockRejectedValue(new Error(errorMessage));

      await expect(controller.getCourses()).rejects.toThrow(Error);
      expect(coursesService.getCourses).toHaveBeenCalled();
    });
  });

  describe('getPublishedCourses', () => {
    const mockPublishedCourses = [
      {
        id: 'course-1',
        title: 'Introduction to Programming',
        description: 'Learn the basics of programming',
        price: 49.99,
        thumbnail: 'https://example.com/thumb1.jpg',
        published: true,
      },
    ];

    it('should return only published courses', async () => {
      mockCoursesService.getPublishedCourses.mockResolvedValue(mockPublishedCourses);

      const result = await controller.getPublishedCourses();

      expect(coursesService.getPublishedCourses).toHaveBeenCalled();
      expect(result).toEqual(mockPublishedCourses);
    });
  });

  describe('getSingleCourse', () => {
    const courseId = 'course-123';
    const mockCourse = {
      id: courseId,
      title: 'Introduction to Programming',
      description: 'Learn the basics of programming',
      price: 49.99,
      thumbnail: 'https://example.com/thumb1.jpg',
      published: true,
    };

    it('should return a single course by ID', async () => {
      mockCoursesService.getSingleCourse.mockResolvedValue(mockCourse);

      const result = await controller.getSingleCourse(courseId);

      expect(coursesService.getSingleCourse).toHaveBeenCalledWith(courseId);
      expect(result).toEqual(mockCourse);
    });

    it('should throw BadRequestException when course not found', async () => {
      mockCoursesService.getSingleCourse.mockRejectedValue(
        new BadRequestException('Course not found')
      );

      await expect(controller.getSingleCourse(courseId))
        .rejects
        .toThrow(BadRequestException);
      
      expect(coursesService.getSingleCourse).toHaveBeenCalledWith(courseId);
    });
  });

  describe('getLessonsForCourse', () => {
    const courseId = 'course-123';
    const mockLessons = [
      {
        id: 'lesson-1',
        title: 'Introduction to Variables',
        videoUrl: 'https://example.com/video1.mp4',
        courseId: courseId,
      },
      {
        id: 'lesson-2',
        title: 'Understanding Loops',
        videoUrl: 'https://example.com/video2.mp4',
        courseId: courseId,
      },
    ];

    it('should return lessons for a course', async () => {
      mockCoursesService.getLessonsForCourse.mockResolvedValue(mockLessons);

      const result = await controller.getLessonsForCourse(courseId);

      expect(coursesService.getLessonsForCourse).toHaveBeenCalledWith(courseId);
      expect(result).toEqual(mockLessons);
    });
  });

  describe('createCourse', () => {
    const mockUser: UserDto = {
      id: 'user-123',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      avatarUrl: 'https://example.com/avatar.jpg',
      role: 'instructor',
    };

    const mockCourseData: any = {
      title: 'New Course',
      description: 'Course description',
      whatYouWillLearn: 'Learning objectives',
      language: 'English',
      price: 49.99,
      category: 'Programming',
      published: false,
    };

    const mockPhoto = {
      fieldname: 'photo',
      originalname: 'course.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test'),
      size: 1024,
    } as Express.Multer.File;

    const mockCreatedCourse = {
      id: 'course-123',
      title: 'New Course',
      description: 'Course description',
      whatYouWillLearn: 'Learning objectives',
      language: 'English',
      price: 49.99,
      category: 'Programming',
      published: false,
      thumbnail: 'https://example.com/thumb.jpg',
      instructorId: mockUser.id,
      studentsEnrolled: [],
    };

    it('should create a new course successfully', async () => {
      mockCoursesService.createCourses.mockResolvedValue(mockCreatedCourse);

      const result = await controller.createCourse(mockUser, mockCourseData, mockPhoto);

      expect(coursesService.createCourses).toHaveBeenCalledWith(
        mockCourseData,
        mockPhoto,
        mockUser
      );
      expect(result).toEqual(mockCreatedCourse);
    });

    it('should throw BadRequestException when course creation fails', async () => {
      mockCoursesService.createCourses.mockRejectedValue(
        new BadRequestException('Photo is required')
      );

      await expect(controller.createCourse(mockUser, mockCourseData, mockPhoto))
        .rejects
        .toThrow(BadRequestException);
      
      expect(coursesService.createCourses).toHaveBeenCalledWith(
        mockCourseData,
        mockPhoto,
        mockUser
      );
    });
  });

  describe('updateCoursePublishStatus', () => {
    const courseId = 'course-123';
    const published = true;
    const mockUser: UserDto = {
      id: 'user-123',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      avatarUrl: 'https://example.com/avatar.jpg',
      role: 'admin',
    };

    const mockUpdatedCourse = {
      id: courseId,
      title: 'Updated Course',
      published: true,
    };

    it('should update course publish status successfully', async () => {
      mockCoursesService.updateCourseStatus.mockResolvedValue(mockUpdatedCourse);

      const result = await controller.updateCoursePublishStatus(courseId, published, mockUser);

      expect(coursesService.updateCourseStatus).toHaveBeenCalledWith(
        courseId,
        published,
        mockUser.id
      );
      expect(result).toEqual(mockUpdatedCourse);
    });

    it('should throw ForbiddenException when user is not authorized', async () => {
      mockCoursesService.updateCourseStatus.mockRejectedValue(
        new ForbiddenException('Not authorized to update this course')
      );

      await expect(controller.updateCoursePublishStatus(courseId, published, mockUser))
        .rejects
        .toThrow(ForbiddenException);
    });
  });

  describe('uploadLessonVideos', () => {
    const courseId = 'course-123';
    const mockUser: UserDto = {
      id: 'user-123',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      avatarUrl: 'https://example.com/avatar.jpg',
      role: 'instructor',
    };

    const mockLessons: any[] = [
      {
        title: 'Lesson 1',
        courseId: courseId,
      },
      {
        title: 'Lesson 2',
        courseId: courseId,
      },
    ];

    const mockVideos = [
      {
        fieldname: 'videos',
        originalname: 'lesson1.mp4',
        encoding: '7bit',
        mimetype: 'video/mp4',
        buffer: Buffer.from('video1'),
        size: 1024000,
      },
      {
        fieldname: 'videos',
        originalname: 'lesson2.mp4',
        encoding: '7bit',
        mimetype: 'video/mp4',
        buffer: Buffer.from('video2'),
        size: 2048000,
      },
    ] as Express.Multer.File[];

    const mockCreatedLessons = [
      {
        id: 'lesson-1',
        title: 'Lesson 1',
        videoUrl: 'https://example.com/video1.mp4',
        courseId: courseId,
      },
      {
        id: 'lesson-2',
        title: 'Lesson 2',
        videoUrl: 'https://example.com/video2.mp4',
        courseId: courseId,
      },
    ];

    it('should upload lesson videos successfully', async () => {
      mockCoursesService.putLessons.mockResolvedValue(mockCreatedLessons);

      const result = await controller.uploadLessonVideos(
        courseId,
        mockUser,
        JSON.stringify(mockLessons),
        mockVideos
      );

      expect(coursesService.putLessons).toHaveBeenCalledWith(
        courseId,
        mockLessons,
        mockVideos,
        mockUser
      );
      expect(result).toEqual(mockCreatedLessons);
    });

    it('should throw error when lessons and videos count mismatch', async () => {
      const errorMessage = 'Each lesson must have exactly one video';
      mockCoursesService.putLessons.mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.uploadLessonVideos(courseId, mockUser, JSON.stringify(mockLessons), mockVideos)
      ).rejects.toThrow(Error);
    });
  });

  describe('getCourseReviews', () => {
    const courseId = 'course-123';
    const mockReviews = [
      {
        id: 'review-1',
        userId: 'user-123',
        rating: 5,
        comment: 'Great course!',
        date: new Date(),
        courseId: courseId,
      },
    ];

    it('should return reviews for a course', async () => {
      mockCoursesService.getCourseReviews.mockResolvedValue(mockReviews);

      const result = await controller.getCourseReviews(courseId);

      expect(coursesService.getCourseReviews).toHaveBeenCalledWith(courseId);
      expect(result).toEqual(mockReviews);
    });
  });

  describe('createCourseReview', () => {
    const courseId = 'course-123';
    const rating = 5;
    const comment = 'Excellent course!';
    const mockUser: UserDto = {
      id: 'user-123',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      avatarUrl: 'https://example.com/avatar.jpg',
      role: 'student',
    };

    const mockCreatedReview = {
      id: 'review-1',
      courseId: courseId,
      userId: mockUser.id,
      rating: rating,
      comment: comment,
      date: new Date(),
    };

    it('should create a course review successfully', async () => {
      mockCoursesService.createCourseReview.mockResolvedValue(mockCreatedReview);

      const result = await controller.createCourseReview(courseId, mockUser, rating, comment);

      expect(coursesService.createCourseReview).toHaveBeenCalledWith(
        courseId,
        mockUser.id,
        rating,
        comment
      );
      expect(result).toEqual(mockCreatedReview);
    });

    it('should throw BadRequestException when user already reviewed', async () => {
      mockCoursesService.createCourseReview.mockRejectedValue(
        new BadRequestException('User has already reviewed this course')
      );

      await expect(controller.createCourseReview(courseId, mockUser, rating, comment))
        .rejects
        .toThrow(BadRequestException);
    });
  });
});