import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CourseDto } from './dto/courses.dto';

describe('CoursesController', () => {
  let controller: CoursesController;
  let service: CoursesService;

  beforeEach(async () => {
    const mockCoursesService = {
      getCourses: jest.fn(),
      getSingleCourse: jest.fn(),
      getPublishedCourses: jest.fn(),
      getLessonsForCourse: jest.fn(),
      createCourses: jest.fn(),
      updateCourseStatus: jest.fn(),
      putLessons: jest.fn(),
    };
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
    service = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCourses', () => {
    it('should return an array of courses', async () => {
      const result: CourseDto[] = [
        {
          id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          title: 'Intro to Programming',
          description: 'Learn programming basics',
          whatYouWillLearn: 'Variables, Loops, Functions',
          language: 'English',
          price: 49.99,
          thumbnail: 'https://example.com/thumbnail.jpg',
          category: 'Programming',
          published: true,
          instructorId: 'instructor-uuid-1234',
          studentsEnrolled: ['student-uuid-1', 'student-uuid-2'],
          lessons: [],
        },
      ];
      jest.spyOn(service, 'getCourses').mockResolvedValue(result);
      expect(await controller.getCourses()).toEqual(result);
    });
  });

  describe('getSingleCourse', () => {
    it('should return a single course by ID', async () => {
      const course: CourseDto = {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        title: 'Intro to Programming',
        description: 'Learn programming basics',
        whatYouWillLearn: 'Variables, Loops, Functions',
        language: 'English',
        price: 49.99,
        thumbnail: 'https://example.com/thumbnail.jpg',
        category: 'Programming',
        published: true,
        instructorId: 'instructor-uuid-1234',
        studentsEnrolled: ['student-uuid-1', 'student-uuid-2'],
        lessons: [],
      };
      jest.spyOn(service, 'getSingleCourse').mockResolvedValue(course);
      expect(await controller.getSingleCourse(course.id)).toEqual(course);
    });
  });

  describe('getPublishedCourses', () => {
    it('should return an array of published courses', async () => {
      const result: CourseDto[] = [
        {
          id: 'pub1',
          title: 'Published Course',
          description: 'Desc',
          whatYouWillLearn: 'Stuff',
          language: 'English',
          price: 10,
          thumbnail: 'thumb',
          category: 'Cat',
          published: true,
          instructorId: 'inst1',
          studentsEnrolled: [],
          lessons: [],
        },
      ];
      jest.spyOn(service, 'getPublishedCourses').mockResolvedValue(result);
      expect(await controller.getPublishedCourses()).toEqual(result);
    });
  });

  describe('getLessonsForCourse', () => {
    it('should return lessons for a course', async () => {
      const lessons = [
        { id: 'l1', title: 'Lesson 1', videoUrl: 'url', courseId: 'c1' },
      ];
      jest.spyOn(service, 'getLessonsForCourse').mockResolvedValue(lessons);
      expect(await controller.getLessonsForCourse('c1')).toEqual(lessons);
    });
  });

  describe('createCourse', () => {
    it('should create a new course', async () => {
      const user = {
        id: 'u1',
        role: 'instructor',
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
      };
      const courseData = { title: 'T', description: 'D', whatYouWillLearn: 'W', language: 'E', price: 1, category: 'C' };
      const photo = { originalname: 'file.jpg' } as any;
      const created = { ...courseData, id: 'cid', thumbnail: 'url', published: false, instructorId: user.id, studentsEnrolled: [] };
      jest.spyOn(service, 'createCourses').mockResolvedValue(created);
      expect(await controller.createCourse(user, courseData as any, photo)).toEqual(created);
    });
  });

  describe('updateCoursePublishStatus', () => {
    it('should update the published status of a course', async () => {
      const updated = {
        id: 'cid',
        title: 'T',
        description: 'D',
        whatYouWillLearn: 'W',
        language: 'E',
        price: 1,
        thumbnail: 'url',
        category: 'C',
        published: true,
        instructorId: 'u1',
        studentsEnrolled: [],
        lessons: [],
      };
      jest.spyOn(service, 'updateCourseStatus').mockResolvedValue(updated);
      expect(await controller.updateCoursePublishStatus('cid', true, { id: 'u1', role: 'admin' } as any)).toEqual(updated);
    });
  });

  describe('uploadLessonVideos', () => {
    it('should upload lessons and videos', async () => {
      const lessons = [{ title: 'L1', courseId: 'cid' }];
      const lessonsJson = JSON.stringify(lessons);
      const videos = [{ originalname: 'v1.mp4' } as any];
      const user = {
        id: 'u1',
        role: 'instructor',
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
      };
      const uploaded = [{ id: 'l1', title: 'L1', videoUrl: 'url', courseId: 'cid' }];
      jest.spyOn(service, 'putLessons').mockResolvedValue(uploaded);
      expect(await controller.uploadLessonVideos('cid', user, lessonsJson, videos)).toEqual(uploaded);
    });
  });
});