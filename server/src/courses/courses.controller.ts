import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
  Param,
  UploadedFiles,
  Put,
  UsePipes,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CoursesService } from './courses.service';
import { CourseDto } from './dto/courses.dto';
import { RegisterUserDto, UserDto } from '../auth/dto/index';
import { User } from '../auth/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { LessonDto } from './dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Courses')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({
    status: 200,
    description: 'List of all courses',
    type: [CourseDto],
  })
  async getCourses() {
    return this.coursesService.getCourses();
  }

  @Get('published')
  @ApiOperation({ summary: 'Get all published courses' })
  @ApiResponse({
    status: 200,
    description: 'List of published courses',
    type: [CourseDto],
  })
  async getPublishedCourses() {
    return this.coursesService.getPublishedCourses();
  }

  @Get('instructor/:instructorId/reviews')
  @ApiOperation({ summary: 'Get all reviews for instructor courses' })
  @ApiResponse({
    status: 200,
    description: 'List of all reviews for instructor courses',
  })
  async getInstructorReviews(@Param('instructorId') instructorId: string) {
    return this.coursesService.getAllCourseReviews(instructorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single course by ID' })
  @ApiResponse({ status: 200, description: 'Single course', type: CourseDto })
  async getSingleCourse(@Param('id') id: string) {
    return this.coursesService.getSingleCourse(id);
  }

  @Get(':id/lessons')
  @ApiOperation({ summary: 'Get all lessons for a course' })
  @ApiResponse({
    status: 200,
    description: 'List of lessons for the course',
    type: [LessonDto],
  })
  async getLessonsForCourse(@Param('id') id: string) {
    return this.coursesService.getLessonsForCourse(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('photo'))
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Course creation payload',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Introduction to Programming' },
        description: {
          type: 'string',
          example: 'Learn the basics of programming using Python.',
        },
        overView: {
          type: 'string',
          example:
            'This comprehensive course covers fundamental programming concepts including variables, data types, control structures, and object-oriented programming principles.',
        },
        whatYouWillLearn: {
          type: 'string',
          example: 'Variables, Loops, Functions, OOP',
        },
        language: { type: 'string', example: 'English' },
        price: { type: 'number', example: 49.99 },
        category: { type: 'string', example: 'Programming' },
        published: { type: 'boolean', example: true },
        photo: {
          type: 'string',
          format: 'binary',
          description: 'Course thumbnail image file ',
        },
      },
      required: [
        'title',
        'description',
        'overView',
        'whatYouWillLearn',
        'language',
        'price',
        'category',
        'published',
      ],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Course created successfully',
    type: CourseDto,
  })
  async createCourse(
    @User() user: UserDto,
    @Body() courseData: CourseDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.coursesService.createCourses(courseData, photo, user);
  }

  @Put(':id/publish')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update the published status of a course' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        published: { type: 'boolean', example: true },
      },
      required: ['published'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Course publish status updated',
    type: CourseDto,
  })
  async updateCoursePublishStatus(
    @Param('id') id: string,
    @Body('published') published: boolean,
    @User() user: UserDto,
  ) {
    return this.coursesService.updateCourseStatus(id, published, user.id);
  }

  @Post(':id/lessons/upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('videos'))
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Upload lesson videos for a course (1 lesson = 1 video)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Upload lessons, each with exactly one title and one video. The lessons field is a JSON array of lesson metadata (title, courseId, etc.), and the videos field is an array of video files. The order of lessons and videos must match: lessons[i] corresponds to videos[i]. Like this: [{"title":"First Lesson"}]',
    schema: {
      type: 'object',
      properties: {
        lessons: {
          type: 'string',
          format: 'json',
          description:
            'Array of lesson metadata (title, courseId, etc.) as JSON string. Each lesson must have exactly one title and one video. The order must match the videos array.',
        },
        videos: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
            description:
              'Video file for the lesson. The order must match the lessons array.',
          },
        },
      },
      required: ['lessons', 'videos'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Lessons uploaded and stored',
    type: [LessonDto],
  })
  async uploadLessonVideos(
    @Param('id') id: string,
    @User() user: UserDto,
    @Body('lessons') lessonsJson: string,
    @UploadedFiles() videos: Express.Multer.File[],
  ) {
    const lessons: LessonDto[] = JSON.parse(lessonsJson);
    if (lessons.length !== videos.length) {
      throw new Error(
        'Each lesson must have exactly one video. The number of lessons and videos must match.',
      );
    }
    return this.coursesService.putLessons(id, lessons, videos, user);
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get all reviews for a course' })
  @ApiResponse({ status: 200, description: 'List of reviews for the course' })
  async getCourseReviews(@Param('id') id: string) {
    return this.coursesService.getCourseReviews(id);
  }

  @Post(':id/reviews')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create a review for a course' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        rating: { type: 'integer', example: 5 },
        comment: { type: 'string', example: 'Great course!' },
      },
      required: ['rating', 'comment'],
    },
  })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  async createCourseReview(
    @Param('id') id: string,
    @User() user: UserDto,
    @Body('rating') rating: number,
    @Body('comment') comment: string,
  ) {
    return this.coursesService.createCourseReview(id, user.id, rating, comment);
  }

  @Delete(':id/lessons/:lessonId')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete a lesson' })
  @ApiResponse({ status: 200, description: 'Lesson deleted successfully' })
  async deleteLesson(@Param('lessonId') lessonId: string) {
    return this.coursesService.deleteLesson(lessonId);
  }
}
