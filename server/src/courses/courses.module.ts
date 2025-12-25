import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [CoursesController],
  providers: [CoursesService, CloudinaryService],
})
export class CoursesModule {}
