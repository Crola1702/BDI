import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';

@Module({
  providers: [PostService],
  imports: [TypeOrmModule.forFeature([PostEntity])],
  controllers: [PostController],
})
export class PostModule {}
