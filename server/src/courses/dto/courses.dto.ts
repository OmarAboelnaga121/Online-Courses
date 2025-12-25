import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CourseDto {
  @ApiProperty({
    example: 'Introduction to Programming',
    description: 'Title of the course',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Learn the basics of programming using Python.',
    description: 'Description of the course',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example:
      'This comprehensive course covers fundamental programming concepts including variables, data types, control structures, and object-oriented programming principles.',
    description: 'Overview of the course content and structure',
  })
  @IsString()
  @IsNotEmpty()
  overView: string;

  @ApiProperty({
    example: 'Variables, Loops, Functions, OOP',
    description: 'What students will learn in this course',
  })
  @IsString()
  @IsNotEmpty()
  whatYouWillLearn: string;

  @ApiProperty({ example: 'English', description: 'Language of instruction' })
  @IsString()
  @IsNotEmpty()
  language: string;

  @ApiProperty({ example: 49.99, description: 'Price of the course' })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'Programming',
    description: 'Category of the course',
  })
  @IsString()
  @IsNotEmpty()
  category: string;
}
