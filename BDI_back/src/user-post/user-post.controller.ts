import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UserPostService } from './user-post.service';
import { PostDto } from '../post/post.dto';
import { PostEntity } from '../post/post.entity';
import { Roles } from '../shared/security/roles.decorator';
import { Public } from '../shared/security/public.decorator';
import { UserRole } from '../shared/enums/role.enum';


@Controller('users')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserPostController {
    constructor(private readonly userPostService: UserPostService) {}

    @Roles(UserRole.ADMIN, UserRole.USER_POST_ADMIN, UserRole.USER_POST_WRITE)
    @Post(':userId/posts/:postId')
    async addPostToUser(@Param('userId') userId: string, @Param('postId') postId: string) {
        return await this.userPostService.addPostUser(userId, postId);
    }

    // @Public()
    @Roles(UserRole.ADMIN, UserRole.USER_POST_ADMIN, UserRole.USER_POST_READ)
    @Get(':userId/posts/:postId')
    async findPostByUserIdPostId(@Param('userId') userId: string, @Param('postId') postId: string) {
        return await this.userPostService.findPostByUserIdPostId(userId, postId);
    }

    // @Public()
    @Roles(UserRole.ADMIN, UserRole.USER_POST_ADMIN, UserRole.USER_POST_READ)
    @Get(':userId/posts')
    async findPostsByUserId(@Param('userId') userId: string) {
        return await this.userPostService.findPostsByUserId(userId);
    }

    @Roles(UserRole.ADMIN, UserRole.USER_POST_ADMIN, UserRole.USER_POST_WRITE)
    @Put(':userId/posts')
    async associatePostsUser( @Body() PostDto: PostDto[], @Param('userId') userId: string) {
        const posts = plainToInstance(PostEntity, PostDto);
        return await this.userPostService.associatePostsUser(userId, posts);
    }

    @Roles(UserRole.ADMIN, UserRole.USER_POST_ADMIN, UserRole.USER_POST_DELETE)
    @Delete(':userId/posts/:postId')
    @HttpCode(204)
    async deletePostUser(@Param('userId') userId: string, @Param('postId') postId: string) {
        return await this.userPostService.deletePostFromUser(userId, postId);
    }

}