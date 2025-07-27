import { BadRequestException, Injectable } from '@nestjs/common';
import prisma from '../prismaClient';
import { CourseDto } from './dto/courses.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserDto } from '../auth/dto';
import { LessonDto } from './dto';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class CoursesService {
    constructor(private cloudinaryService : CloudinaryService){}

    async getCourses(){
        const courses = await prisma.course.findMany()
        return courses;
    }

    async createCourses(courseData : CourseDto, photo: Express.Multer.File, user : UserDto){

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
                price: Number(courseData.price),
                thumbnail: uploadResult.url,
                category: courseData.category,
                published: false ,
                instructorId: user.id,
                studentsEnrolled: [],
            },
        });
        return course;
    }
    
    async getSingleCourse(id: string) {
        const course = await prisma.course.findUnique({ where: { id } });
        if (!course) {
            throw new BadRequestException('Course not found');
        }
        return course;
    }

    async getLessonsForCourse(id: string) {
        // Fetch all lessons for the given course id
        const lessons = await prisma.lesson.findMany({ where: { courseId: id } });
        return lessons;
    }
    
    async getPublishedCourses(){
        const courses = await prisma.course.findMany({where:{published:true}})
        return courses;
    }

    async updateCourseStatus(id: string, published: boolean, userId : string){
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
        return updatedCourse;
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
        return updatedCourse.lessons;
    }


    async 
    async getCourseReviews(courseId: string) {
        // Fetch all reviews for the given course id
        const reviews = await prisma.review.findMany({
            where: { courseId },
            orderBy: { date: 'desc' },
        });
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
        return review;
    }
}
