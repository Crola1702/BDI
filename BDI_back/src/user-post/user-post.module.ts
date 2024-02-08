import { Module } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { UserPostService } from './user-post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../post/post.entity';
import { UserPostController } from './user-post.controller';
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PostEntity])],
  providers: [UserPostService],
  controllers: [UserPostController]
})
export class UserPostModule {}
