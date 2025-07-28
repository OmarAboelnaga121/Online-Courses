import { Body, Controller, Get, Param, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/auth/decorators/user.decorator';
import { UserDto } from 'src/auth/dto';
import { UsersService } from './users.service';
import { updateUserDto } from './dto/updateUser.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // TODO: Get User Profile
    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get user profile' })
    @ApiBearerAuth()
    getProfile(
        @User() user : UserDto
    ) {
        return user;
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
                            thumbnail: { type: 'string' }
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Instructor not found or invalid role' })
    async getInstructorProfile(@Param('id') id: string) {
        return this.usersService.getInstructorProfile(id);
    }

    // TODO: Update User Profile
    @Put('profile')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('photo'))
    @ApiBearerAuth()
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
                    description: 'Profile photo file'
                }
            }
        }
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
                wishList: { type: 'array', items: { type: 'string' } }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
    async updateProfile(
        @User() user: UserDto,
        @Body() updateData: updateUserDto,
        @UploadedFile() photo?: Express.Multer.File
    ) {
        return this.usersService.updateUserProfile(user, updateData, photo);
    }
}
