import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    CoursesModule,
    CloudinaryModule,
 ],
})
export class AppModule {}
