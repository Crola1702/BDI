import { Body, Controller, Get, Param, Put, Post, Delete, UseInterceptors, HttpCode } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CommentDto } from './comment.dto';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';
import { Roles } from '../shared/security/roles.decorator';
import { Public } from '../shared/security/public.decorator';

@Controller('post/comments')
@UseInterceptors(BusinessErrorsInterceptor)
export class CommentController {
    constructor(private readonly commentService: CommentService){}  

    @Public()
    @Get('all')
    async findAll(){
        return await this.commentService.findAll();
    }

    @Public()
    @Get(':commentId')
    async findOne(@Param(':commentId') commentId: string){
        return await this.commentService.findOne(commentId);
    }

    @Roles('admin', 'user', 'seller')
    @Post()
    async create(@Body() commentDto: CommentDto){
        const comment: CommentEntity = plainToInstance(CommentEntity, commentDto);
        return await this.commentService.create(comment);
    }

    @Roles('admin', 'user', 'seller')
    @Put(':comentId')
    async update(@Param(':commentId') commentId: string, @Body() commentDto: CommentDto){
        const comment: CommentEntity = plainToInstance(CommentEntity, commentDto);
        return await this.commentService.update(commentId,comment)
    }

    @Roles('admin', 'seller')
    @Delete(':commentId')
    @HttpCode(204)
    async delete(@Param(':commentId') commentId: string){
        return await this.commentService.delete(commentId)
    }

}
