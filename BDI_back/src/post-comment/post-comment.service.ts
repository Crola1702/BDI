import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../comment/comment.entity';
import { PostEntity } from '../post/post.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class PostCommentService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,

        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>
    ){}

    async addCommentPost(postId: string, commentId: string): Promise<PostEntity>{
        const comment: CommentEntity = await this.commentRepository.findOne({where: {id : commentId}});
        if (!comment)
            throw new BusinessLogicException("No se encontro el comentario", BusinessError.NOT_FOUND);

        const post: PostEntity = await this.postRepository.findOne({where : {id : postId}, relations : ['publisher', 'property','comments']});
        if (!post)
            throw new BusinessLogicException("No se encontro la publicacion", BusinessError.NOT_FOUND);

        post.comments = [...post.comments, comment];
        return await this.postRepository.save(post);
    }

    async findCommentByPostIdCommentId(postId: string, commentId: string): Promise<CommentEntity>{
        const comment: CommentEntity = await this.commentRepository.findOne({where: {id : commentId}});
        if (!comment)
            throw new BusinessLogicException("No se encontro el comentario", BusinessError.NOT_FOUND);

        const post: PostEntity = await this.postRepository.findOne({where : {id : postId}, relations : ['publisher', 'property','comments']});
        if (!post)
            throw new BusinessLogicException("No se encontro la publicacion", BusinessError.NOT_FOUND);
        
        const postComment: CommentEntity = post.comments.find(e => e.id == comment.id);
        if (!postComment)
            throw new BusinessLogicException("El comentario no está asociado a la publicacion", BusinessError.PRECONDITION_FAILED);
        
        return postComment;
    }

    async findCommentsByPostId(postId: string): Promise<CommentEntity[]> {
        const post: PostEntity = await this.postRepository.findOne({where : {id : postId}, relations : ['publisher', 'property','comments']});
        if (!post)
            throw new BusinessLogicException("No se encontro la publicacion", BusinessError.NOT_FOUND);

        return post.comments
    }

    async associateCommentPost(postId: string, comments: CommentEntity[]): Promise<PostEntity>{
        const post: PostEntity = await this.postRepository.findOne({where : {id : postId}, relations : ['publisher', 'property','comments']});
        if (!post)
            throw new BusinessLogicException("No se encontro la publicacion", BusinessError.NOT_FOUND);

        for (let i = 0; i<comments.length; i++){
            const comment: CommentEntity = await this.commentRepository.findOne({where: {id : comments[i].id}});
            if (!comment)
                throw new BusinessLogicException("No se encontro el comentario", BusinessError.NOT_FOUND);
        }

        post.comments = comments;
        return await this.postRepository.save(post);
    }

    async deleteCommentPost(postId: string, commentId: string){
        const comment: CommentEntity = await this.commentRepository.findOne({where: {id : commentId}});
        if (!comment)
            throw new BusinessLogicException("No se encontro el comentario", BusinessError.NOT_FOUND);

        const post: PostEntity = await this.postRepository.findOne({where : {id : postId}, relations : ['publisher', 'property','comments']});
        if (!post)
            throw new BusinessLogicException("No se encontro la publicacion", BusinessError.NOT_FOUND);

        const postComment: CommentEntity = post.comments.find(e => e.id === comment.id);
        if (!postComment)
            throw new BusinessLogicException("El comentario no está asociado a la publicacion", BusinessError.PRECONDITION_FAILED);

        post.comments = post.comments.filter(e => e.id !== commentId);
        await this.postRepository.save(post);
    }
}
