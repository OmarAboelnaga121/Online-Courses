import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [CloudinaryModule, RedisModule],
})
export class UsersModule {}
