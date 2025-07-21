import { Controller, Get } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CourseDto } from './dto/courses.dto';

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
}
