import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDto } from '../auth/dto';
import prisma from '../prismaClient';
import { updateUserDto } from './dto/updateUser.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UsersService {
  constructor(
    private cloudinaryService: CloudinaryService,
    private redisService: RedisService,
  ) {}

  async updateUserProfile(
    user: UserDto,
    newData: updateUserDto,
    photo?: Express.Multer.File,
  ) {
    // Check if username is being changed and if it's already taken
    if (newData.username) {
      const usernameExists = await prisma.user.findUnique({
        where: { username: newData.username },
      });
      if (usernameExists && usernameExists.id !== user.id) {
        throw new BadRequestException('Username already taken');
      }
    }

    // Upload photo to Cloudinary if provided
    let avatarUrl = newData.avatarUrl;
    if (photo) {
      try {
        const uploadResult = await this.cloudinaryService.uploadFile(photo);
        if (!uploadResult || !uploadResult.url) {
          throw new BadRequestException('Failed to upload photo');
        }
        avatarUrl = uploadResult.url;
      } catch (error) {
        throw new BadRequestException(
          'Failed to upload photo: ' + error.message,
        );
      }
    }

    // Update user with photo URL if uploaded
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: newData.name,
        username: newData.username,
        avatarUrl: avatarUrl,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatarUrl: true,
        role: true,
        enrolledCourses: true,
        wishList: true,
      },
    });

    // Invalidate instructor cache if user is an instructor
    if (user.role === 'instructor') {
      await this.redisService.del(`instructor:${user.id}`);
    }

    // Invalidate comprehensive user profile cache
    await this.redisService.del(`user:${user.id}:comprehensive`);

    return updatedUser;
  }

  // TODO: Get Instructor Profile
  async getInstructorProfile(instructorId: string) {
    // Try to get from cache first
    const cacheKey = `instructor:${instructorId}`;
    const cachedInstructor = await this.redisService.get(cacheKey);

    if (cachedInstructor) {
      return JSON.parse(cachedInstructor);
    }

    // If not in cache, fetch from database
    const instructor = await prisma.user.findUnique({
      where: { id: instructorId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatarUrl: true,
        role: true,
        myCourses: true,
      },
    });

    if (!instructor || instructor.role !== 'instructor') {
      throw new BadRequestException('Instructor not found or invalid role');
    }

    // Cache the result for 15 minutes (900 seconds)
    await this.redisService.set(cacheKey, JSON.stringify(instructor), 900);

    return instructor;
  }

  // Get comprehensive user profile with all related data
  async getComprehensiveUserProfile(userId: string) {
    // Try to get from cache first
    const cacheKey = `user:${userId}:comprehensive`;
    const cachedUser = await this.redisService.get(cacheKey);

    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    // If not in cache, fetch comprehensive data from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        payments: {
          orderBy: {
            date: 'desc',
          },
        },
        myCourses: {
          include: {
            lessons: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Get enrolled courses details
    const enrolledCoursesDetails = await prisma.course.findMany({
      where: {
        id: {
          in: user.enrolledCourses,
        },
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
        lessons: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Get wishlist courses details
    const wishlistCoursesDetails = await prisma.course.findMany({
      where: {
        id: {
          in: user.wishList,
        },
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Get payment details with course information
    const paymentsWithCourses = await Promise.all(
      user.payments.map(async (payment) => {
        const course = await prisma.course.findUnique({
          where: { id: payment.courseId.toString() },
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        });

        return {
          ...payment,
          course: course,
        };
      }),
    );

    // Calculate total spent
    const totalSpent = user.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );

    // Prepare comprehensive user data
    const comprehensiveUserData = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
      enrolledCourses: enrolledCoursesDetails,
      wishList: wishlistCoursesDetails,
      payments: paymentsWithCourses,
      myCourses: user.myCourses,
      statistics: {
        totalSpent: totalSpent,
        totalCoursesEnrolled: user.enrolledCourses.length,
        totalWishlistItems: user.wishList.length,
        totalCoursesCreated: user.myCourses.length,
        totalPayments: user.payments.length,
      },
    };

    // Cache the result for 10 minutes (600 seconds)
    await this.redisService.set(
      cacheKey,
      JSON.stringify(comprehensiveUserData),
      600,
    );

    return comprehensiveUserData;
  }

  async getAllUsers(user: UserDto) {
    if (user.role !== 'admin') {
      throw new BadRequestException('You are not authorized to get all users');
    }

    const users = await prisma.user.findMany();
    return users;
  }
}
