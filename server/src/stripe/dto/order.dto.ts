import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCheckoutSessionDto {
    @ApiProperty({
        description: 'The ID of the course to purchase',
        example: 'course-123',
        type: String
    })
    @IsString()
    @IsNotEmpty()
    courseId: string;
}