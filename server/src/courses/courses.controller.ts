import { Controller, Get, Post, Body, UploadedFile, UseInterceptors, Req, UseGuards, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { CoursesService } from './courses.service';
import { CourseDto } from './dto/courses.dto';
import { RegisterUserDto, UserDto } from '../auth/dto/index';
import { User } from '../auth/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({ status: 200, description: 'List of all courses', type: [CourseDto] })
  async getCourses() {
    return this.coursesService.getCourses();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single course by ID' })
  @ApiResponse({ status: 200, description: 'Single course', type: CourseDto })
  async getSingleCourse(@Param('id') id: string) {
    return this.coursesService.getSingleCourse(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt')) 
  @UseInterceptors(FileInterceptor('photo'))
  @ApiOperation({ summary: 'Create a new course' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiBody({
    description: 'Course creation payload',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Introduction to Programming' },
        description: { type: 'string', example: 'Learn the basics of programming using Python.' },
        whatYouWillLearn: { type: 'string', example: 'Variables, Loops, Functions, OOP' },
        language: { type: 'string', example: 'English' },
        price: { type: 'number', example: 49.99 },
        category: { type: 'string', example: 'Programming' },
        published: { type: 'boolean', example: true },
        photo: {
          type: 'string',
          format: 'binary',
          description: 'Course thumbnail image file '
        }
      },
      required: ['title', 'description', 'whatYouWillLearn', 'language', 'price', 'category', 'published']
    }
  })
  @ApiResponse({ status: 201, description: 'Course created successfully', type: CourseDto })
  async createCourse(
    @User() user: UserDto,
    @Body() courseData: CourseDto,
    @UploadedFile() photo: Express.Multer.File
  ) {
    console.log('user in controller:', user);
    return this.coursesService.createCourses(courseData, photo, user);
  }
 
}
