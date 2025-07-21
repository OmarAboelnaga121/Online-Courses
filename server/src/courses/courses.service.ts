import { Injectable } from '@nestjs/common';
import prisma from 'src/prismaClient';

@Injectable()
export class CoursesService {

    async getCourses(){
        const courses = await prisma.course.findMany()
        return courses;
    }

    async createCourses(){}
    async getSingleCourse(){}
    async getPublishedCoures(){}
}
