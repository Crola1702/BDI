import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Public } from '../shared/security/public.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PostDto } from './post.dto';
import { PostEntity } from './post.entity';
import { PostService } from './post.service';
import { Roles } from '../shared/security/roles.decorator';
import { UserRole } from '../shared/enums/role.enum';

import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('posts')
export class PostController {

    constructor(private readonly postService: PostService) {}

    @Public()
    @Get()
    async findAll() {
        return await this.postService.findAll();
    }

    @Public()
    @Get(':postId')
    async findOne(@Param('postId') postId: string) {
        return await this.postService.findOne(postId);
    }

    @Roles(UserRole.ADMIN, UserRole.SELLER, UserRole.POST_ADMIN, UserRole.POST_WRITE)
    @Post()
    async create(@Body() postDto: PostDto) {
        const post: PostEntity = plainToInstance(PostEntity, postDto);
        return await this.postService.create(post);
    }

    @Roles(UserRole.ADMIN, UserRole.SELLER, UserRole.POST_ADMIN, UserRole.POST_WRITE)
    @Put(':postId')
    async update(@Param('postId') postId: string, @Body() postDto: PostDto) {
        const post: PostEntity = plainToInstance(PostEntity, postDto);
        return await this.postService.update(postId, post);
    }

    @Roles(UserRole.ADMIN, UserRole.SELLER, UserRole.POST_ADMIN, UserRole.POST_DELETE)
    @Delete(':postId')
    @HttpCode(204)
    async delete(@Param('postId') postId: string) {
        return await this.postService.delete(postId)
    }

    @Roles(UserRole.ADMIN, UserRole.SELLER, UserRole.POST_ADMIN, UserRole.POST_WRITE)
    @Post(':postId/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@Param('postId') postId: string, @UploadedFile() file: Express.Multer.File) {
       return await this.postService.saveImage(postId, file); 
    }
}
