import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { PostEntity } from '../post/post.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';


@Injectable()
export class UserPostService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>
    ) {}

    async addPostUser(userId: string, postId: string): Promise<UserEntity> {
        const posts : PostEntity = await this.postRepository.findOne({where: {id: postId}});
        if (!posts)
            throw new BusinessLogicException("The post with the given id was not found", BusinessError.NOT_FOUND);

        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["posts"]});
        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
        
        user.posts = [...user.posts, posts]
        return await this.userRepository.save(user);
    }

    async findPostByUserIdPostId(userId: string, postId: string): Promise<PostEntity> {
        const post: PostEntity = await this.postRepository.findOne({where: {id: postId}});
        if (!post)
            throw new BusinessLogicException("The post with the given id was not found", BusinessError.NOT_FOUND);

        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations : ["posts", "posts.property"]});
        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
        const userPost : PostEntity =  user.posts.find(e => e.id === post.id);
        if (!userPost)
            throw new BusinessLogicException("The post with the given id is not associated to the user", BusinessError.PRECONDITION_FAILED);
        
        return userPost;
    }

    async findPostsByUserId(userId: string): Promise<PostEntity[]> {
        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["posts", "posts.publisher", "posts.property"]});
        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
        
        return user.posts;
    }

    async associatePostsUser(userId: string, posts: PostEntity[]): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["posts"]});
        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
        
        for (let i = 0; i < posts.length; i++) {
            const post: PostEntity = await this.postRepository.findOne({where: {id: posts[i].id}});
            if (!post)
                throw new BusinessLogicException("The post with the given id was not found", BusinessError.NOT_FOUND);
        }

        user.posts = posts;
        return await this.userRepository.save(user);
    }

    async deletePostFromUser(userId: string, postId: string) {
        const post: PostEntity = await this.postRepository.findOne({where: {id: postId}});
        if (!post)
            throw new BusinessLogicException("The post with the given id was not found", BusinessError.NOT_FOUND);

        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["posts"]});
        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
        
        const userPost : PostEntity = user.posts.find(p => p.id === post.id);
        if (!userPost)
            throw new BusinessLogicException("The post with the given id is not associated to the user", BusinessError.PRECONDITION_FAILED);

        user.posts = user.posts.filter(p => p.id !== postId);
        return await this.userRepository.save(user);
    }
}
