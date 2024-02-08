import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from '../comment/comment.entity';
import { QuestionResponseService } from './question-response.service';
import { QuestionResponseController } from './question-response.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity])],
  providers: [QuestionResponseService],
  controllers: [QuestionResponseController]
})
export class QuestionResponseModule {}
