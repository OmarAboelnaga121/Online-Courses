import { BadRequestException, Injectable } from '@nestjs/common';
import prisma from 'src/prismaClient';

@Injectable()
export class UsersService {

    // TODO: Update User Profile

    // TODO: Get Instructor Profile
    async getInstructorProfile(instructorId: string) {
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
            }
        });

        if (!instructor || instructor.role !== 'instructor') {
            throw new BadRequestException('Instructor not found or invalid role');
        }
        return instructor;
    }
    
}
