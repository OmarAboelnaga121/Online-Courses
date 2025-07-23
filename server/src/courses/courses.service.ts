import { BadRequestException, Injectable } from '@nestjs/common';
import prisma from '../prismaClient';
import { CourseDto } from './dto/courses.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserDto } from '../auth/dto';

@Injectable()
export class CoursesService {
    constructor(private cloudinaryService : CloudinaryService){}

    async getCourses(){
        const courses = await prisma.course.findMany()
        return courses;
    }

    async createCourses(courseData : CourseDto, photo: Express.Multer.File, user : UserDto){
        console.log('user in service:', user);
        console.log('courseData in service:', courseData);
        console.log('photo in service:', photo);

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
        
        // put the lessons on cloudinary and get the url

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
    async getPublishedCoures(){}
}
