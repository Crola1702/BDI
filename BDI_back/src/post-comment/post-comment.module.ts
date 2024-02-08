import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from '../comment/comment.entity';
import { PostEntity } from '../post/post.entity';
import { PostCommentService } from './post-comment.service';
import { PostCommentController } from './post-comment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity,CommentEntity])],
  providers: [PostCommentService],
  controllers: [PostCommentController]
})
export class PostCommentModule {}
