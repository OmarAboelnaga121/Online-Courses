import { BadRequestException, Injectable } from '@nestjs/common';
import prisma from '../prismaClient';
import { CourseDto } from './dto/courses.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserDto } from '../auth/dto';
import { LessonDto } from './dto';
import { ForbiddenException } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CoursesService {
    constructor(
        private cloudinaryService: CloudinaryService,
        private redisService: RedisService
    ) {}

    async getCourses() {
        // Try to get from cache first
        const cacheKey = 'courses:all';
        const cachedCourses = await this.redisService.get(cacheKey);
        
        if (cachedCourses) {
            return JSON.parse(cachedCourses);
        }

        // If not in cache, fetch from database
        const courses = await prisma.course.findMany();
        
        // Cache the result for 5 minutes (300 seconds)
        await this.redisService.set(cacheKey, JSON.stringify(courses), 300);
        
        return courses;
    }

    async createCourses(courseData: CourseDto, photo: Express.Multer.File, user: UserDto) {
        if (!photo) {
            throw new BadRequestException('Photo is required');
        }
        // Upload photo to Cloudinary
        const uploadResult = await this.cloudinaryService.uploadFile(photo);
        if (!uploadResult || !uploadResult.url) {
            throw new BadRequestException('Failed to upload photo');
        }

        // check if user is instructor
        if (user.role !== 'instructor') {
            throw new BadRequestException('User is not an instructor');
        }
        
        // Create course in DB
        const course = await prisma.course.create({
            data: {
                title: courseData.title,
                description: courseData.description,
                whatYouWillLearn: courseData.whatYouWillLearn,
                language: courseData.language,
                price: courseData.price,
                thumbnail: uploadResult.url,
                category: courseData.category,
                published: false,
                instructorId: user.id,
                studentsEnrolled: [],
            },
        });

        // Invalidate cache after creating new course
        await this.invalidateCoursesCache();
        
        return course;
    }
    
    async getSingleCourse(id: string) {
        // Try to get from cache first
        const cacheKey = `course:${id}`;
        const cachedCourse = await this.redisService.get(cacheKey);
        
        if (cachedCourse) {
            return JSON.parse(cachedCourse);
        }

        // If not in cache, fetch from database
        const course = await prisma.course.findUnique({ where: { id } });
        if (!course) {
            throw new BadRequestException('Course not found');
        }
        
        // Cache the result for 10 minutes (600 seconds)
        await this.redisService.set(cacheKey, JSON.stringify(course), 600);
        
        return course;
    }

    async getLessonsForCourse(id: string) {
        // Try to get from cache first
        const cacheKey = `course:${id}:lessons`;
        const cachedLessons = await this.redisService.get(cacheKey);
        
        if (cachedLessons) {
            return JSON.parse(cachedLessons);
        }

        // If not in cache, fetch from database
        const lessons = await prisma.lesson.findMany({ where: { courseId: id } });
        
        // Cache the result for 15 minutes (900 seconds)
        await this.redisService.set(cacheKey, JSON.stringify(lessons), 900);
        
        return lessons;
    }
    
    async getPublishedCourses() {
        // Try to get from cache first
        const cacheKey = 'courses:published';
        const cachedCourses = await this.redisService.get(cacheKey);
        
        if (cachedCourses) {
            return JSON.parse(cachedCourses);
        }

        // If not in cache, fetch from database
        const courses = await prisma.course.findMany({ where: { published: true } });
        
        // Cache the result for 5 minutes (300 seconds)
        await this.redisService.set(cacheKey, JSON.stringify(courses), 300);
        
        return courses;
    }

    async updateCourseStatus(id: string, published: boolean, userId: string) {
        const course = await prisma.course.findUnique({
            where: { id },
        });
        if (!course) {
            throw new BadRequestException('Course not found');
        }
        // Check if user is instructor or admin
        const checkUser = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!checkUser) {
            throw new BadRequestException('User not found');
        }
        if (checkUser.role !== 'admin') {
            throw new ForbiddenException('Not authorized to update this course');
        }
        
        const updatedCourse = await prisma.course.update({
            where: { id },
            data: { published: published },
        });

        // Invalidate cache after updating course status
        await this.invalidateCoursesCache();
        await this.invalidateCourseCache(id);
        
        return updatedCourse;
    }

    // Helper method to invalidate courses cache
    private async invalidateCoursesCache() {
        await this.redisService.del('courses:all');
        await this.redisService.del('courses:published');
        
        // Invalidate all course-related caches using pattern matching
        await this.redisService.delByPattern('course:*');
    }

    // Helper method to invalidate specific course cache
    private async invalidateCourseCache(courseId: string) {
        await this.redisService.del(`course:${courseId}`);
        await this.redisService.del(`course:${courseId}:lessons`);
        await this.redisService.del(`course:${courseId}:reviews`);
    }

    async putLessons(id: string, lessons: LessonDto[], videos: Express.Multer.File[], user: UserDto) {
        // Find Course
        const course = await prisma.course.findUnique({ where: { id } });
        if (!course) {
            throw new BadRequestException('Course not found');
        }
        // Check if user is instructor
        if (course.instructorId !== user.id) {
            throw new BadRequestException('User is not the instructor of this course');
        }
        if (!Array.isArray(lessons) || !Array.isArray(videos) || lessons.length !== videos.length) {
            throw new BadRequestException('Lessons and videos count mismatch');
        }
        // Upload each video to Cloudinary and update lesson videoUrl
        const lessonsWithUrls = await Promise.all(
            lessons.map(async (lesson, idx) => {
                const videoFile = videos[idx];
                if (!videoFile) throw new BadRequestException('Missing video file for lesson');
                const uploadResult = await this.cloudinaryService.uploadVideoFile(videoFile);
                if (!uploadResult || !uploadResult.url) {
                    throw new BadRequestException('Failed to upload video');
                }
                return {
                    ...lesson,
                    videoUrl: uploadResult.url,
                    courseId: id,
                };
            })
        );

        // Store lessons in DB
        const created = await prisma.lesson.createMany({
            data: lessonsWithUrls,
        });

        
        const updatedCourse = await prisma.course.update({
            where: { id },
            data: {},
            include: { lessons: true },
        });

        // Invalidate course lessons cache after adding new lessons
        await this.invalidateCourseCache(id);
        
        return updatedCourse.lessons;
    }


    async getCourseReviews(courseId: string) {
        // Try to get from cache first
        const cacheKey = `course:${courseId}:reviews`;
        const cachedReviews = await this.redisService.get(cacheKey);
        
        if (cachedReviews) {
            return JSON.parse(cachedReviews);
        }

        // If not in cache, fetch from database
        const reviews = await prisma.review.findMany({
            where: { courseId },
            orderBy: { date: 'desc' },
        });
        
        // Cache the result for 10 minutes (600 seconds)
        await this.redisService.set(cacheKey, JSON.stringify(reviews), 600);
        
        return reviews;
    }

    async createCourseReview(courseId: string, userId: string, rating: number, comment: string) {
        // Check if course exists
        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) {
            throw new BadRequestException('Course not found');
        }
        // Optionally: Check if user already reviewed this course
        const existingReview = await prisma.review.findFirst({ where: { courseId, userId } });
        if (existingReview) {
            throw new BadRequestException('User has already reviewed this course');
        }

        // Check if user is a student
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        if (user.role !== 'student') {
            throw new ForbiddenException('Only students can leave reviews');
        }

        // Create review
        const review = await prisma.review.create({
            data: {
                courseId,
                userId,
                rating,
                comment,
                date: new Date(),
            },
        });

        // Invalidate course reviews cache after creating new review
        await this.invalidateCourseCache(courseId);
        
        return review;
    }
}
