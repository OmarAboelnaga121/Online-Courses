import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsArray, IsUrl, IsUUID, ArrayNotEmpty } from 'class-validator';

export class CourseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'Unique identifier for the course' })
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'Introduction to Programming', description: 'Title of the course' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Learn the basics of programming using Python.', description: 'Description of the course' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Variables, Loops, Functions, OOP', description: 'What students will learn in this course' })
  @IsString()
  @IsNotEmpty()
  whatYouWillLearn: string;

  @ApiProperty({ example: 'English', description: 'Language of instruction' })
  @IsString()
  @IsNotEmpty()
  language: string;

  @ApiProperty({ example: 49.99, description: 'Price of the course' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'https://example.com/thumbnail.jpg', description: 'URL of the course thumbnail image' })
  @IsString()
  @IsUrl()
  thumbnail: string;

  @ApiProperty({ example: 'Programming', description: 'Category of the course' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: true, description: 'Whether the course is published' })
  @IsBoolean()
  published: boolean;

  @ApiProperty({ example: 'instructor-uuid-1234', description: 'ID of the instructor who created the course' })
  @IsString()
  @IsNotEmpty()
  instructorId: string;

  @ApiProperty({ example: ['student-uuid-1', 'student-uuid-2'], description: 'List of enrolled student IDs', type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  studentsEnrolled: string[];

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString()
  lessons: string[];
}