import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiCookieAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { User } from '../auth/decorators/user.decorator';
import { UserDto } from '../auth/dto';
import { UsersService } from './users.service';
import { updateUserDto } from './dto/updateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: Get User Profile
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Get comprehensive user profile with all related data',
  })
  @ApiResponse({
    status: 200,
    description: 'Comprehensive user profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
        avatarUrl: { type: 'string' },
        role: { type: 'string' },
        enrolledCourses: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              thumbnail: { type: 'string' },
              price: { type: 'number' },
              instructor: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  username: { type: 'string' },
                  avatarUrl: { type: 'string' },
                },
              },
              lessons: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        wishList: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              thumbnail: { type: 'string' },
              price: { type: 'number' },
              instructor: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  username: { type: 'string' },
                  avatarUrl: { type: 'string' },
                },
              },
            },
          },
        },
        payments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              amount: { type: 'number' },
              date: { type: 'string', format: 'date-time' },
              status: { type: 'string' },
              method: { type: 'string' },
              course: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  thumbnail: { type: 'string' },
                  price: { type: 'number' },
                  instructor: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      username: { type: 'string' },
                      avatarUrl: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
        myCourses: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              thumbnail: { type: 'string' },
              price: { type: 'number' },
              published: { type: 'boolean' },
              studentsEnrolled: { type: 'array', items: { type: 'string' } },
              lessons: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        statistics: {
          type: 'object',
          properties: {
            totalSpent: { type: 'number' },
            totalCoursesEnrolled: { type: 'number' },
            totalWishlistItems: { type: 'number' },
            totalCoursesCreated: { type: 'number' },
            totalPayments: { type: 'number' },
          },
        },
      },
    },
  })
  async getProfile(@User() user: UserDto) {
    return this.usersService.getComprehensiveUserProfile(user.id);
  }

  @Get('instructor/:id')
  @ApiOperation({ summary: 'Get instructor profile' })
  @ApiParam({ name: 'id', description: 'Instructor ID' })
  @ApiResponse({
    status: 200,
    description: 'Instructor profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
        avatarUrl: { type: 'string' },
        role: { type: 'string', enum: ['instructor'] },
        myCourses: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              thumbnail: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Instructor not found or invalid role',
  })
  async getInstructorProfile(@Param('id') id: string) {
    return this.usersService.getInstructorProfile(id);
  }

  // TODO: Update User Profile
  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('photo'))
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User profile update with optional photo',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe' },
        username: { type: 'string', example: 'johndoe' },
        photo: {
          type: 'string',
          format: 'binary',
          description: 'Profile photo file',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
        avatarUrl: { type: 'string' },
        role: { type: 'string' },
        enrolledCourses: { type: 'array', items: { type: 'string' } },
        wishList: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  async updateProfile(
    @User() user: UserDto,
    @Body() updateData: updateUserDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    return this.usersService.updateUserProfile(user, updateData, photo);
  }

  // TODO: Get All Users
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'All users retrieved successfully' })
  async getAllUsers(@User() user: UserDto) {
    return this.usersService.getAllUsers(user);
  }
}
