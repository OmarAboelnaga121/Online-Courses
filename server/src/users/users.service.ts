import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDto } from 'src/auth/dto';
import prisma from 'src/prismaClient';
import { updateUserDto } from './dto/updateUser.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
    constructor(private cloudinaryService: CloudinaryService) {}

    async updateUserProfile(user: UserDto, newData: updateUserDto, photo?: Express.Multer.File) {
        // Check if username is being changed and if it's already taken
        if (newData.username) {
            const usernameExists = await prisma.user.findUnique({
                where: { username: newData.username }
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
                throw new BadRequestException('Failed to upload photo: ' + error.message);
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
            }
        });

        return updatedUser;
    }

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
