import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class LessonDto {
  @ApiProperty({
    example: 'Lesson 1: Introduction',
    description: 'Title of the lesson',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'https://example.com/video.mp4',
    description: 'URL of the lesson video',
  })
  @IsString()
  @IsNotEmpty()
  videoUrl: string;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'ID of the course this lesson belongs to',
  })
  @IsUUID()
  @IsNotEmpty()
  courseId: string;
}
