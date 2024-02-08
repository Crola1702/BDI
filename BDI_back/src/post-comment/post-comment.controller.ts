import { Controller, Param, Post, UseInterceptors, Get, Put, Body, Delete, HttpCode } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PostCommentService } from './post-comment.service';
import { CommentEntity } from '../comment/comment.entity';
import { Roles } from '../shared/security/roles.decorator';
import { Public } from '../shared/security/public.decorator';

@Controller('post')
@UseInterceptors(BusinessErrorsInterceptor)
export class PostCommentController {
    constructor(private readonly postCommentService: PostCommentService) {}

    @Roles('admin','seller','user')
    @Post(':postId/comment/:commentId')
    async addCommentPost(@Param('postId') postId: string, @Param('commentId') commentId: string) {
        return this.postCommentService.addCommentPost(postId, commentId);
    }

    @Public()
    @Get(':postId/comments')
    async getPostComments(@Param('postId') postId: string) {
        return this.postCommentService.findCommentsByPostId(postId);
    }

    @Public()
    @Get(':postId/comment/:commentId')
    async getPostComment(@Param('postId') postId: string, @Param('commentId') commentId: string) {
        return this.postCommentService.findCommentByPostIdCommentId(postId, commentId);
    }

    @Roles('admin','seller','user')
    @Put(':postId/comments')
    async associateCommentPost(@Param('postId') postId: string, @Body() comments: CommentEntity[]) {
        return this.postCommentService.associateCommentPost(postId, comments);
    }

    @Roles('admin','seller','user')
    @Delete(':postId/comments/:commentId')
    @HttpCode(204)
    async deleteCommentPost(@Param('postId') postId: string, @Param('commentId') commentId: string) {
        return this.postCommentService.deleteCommentPost(postId, commentId);
    }
}
