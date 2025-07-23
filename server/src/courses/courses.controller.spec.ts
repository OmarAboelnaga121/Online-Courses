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
      };
      jest.spyOn(service, 'getSingleCourse').mockResolvedValue(course);
      expect(await controller.getSingleCourse(course.id)).toEqual(course);
    });
  });
});