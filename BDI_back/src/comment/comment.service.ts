import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentService {

    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>
    ){}
    
    async findAll(): Promise<CommentEntity[]> {
        return await this.commentRepository.find({relations: ["post","response"]});
    }
    
    async findOne(commentId: string): Promise<CommentEntity>{
        const comment: CommentEntity = await this.commentRepository.findOne({where: {id: commentId}});
        if (!comment)
            throw new BusinessLogicException("No se encontro el comentario", BusinessError.NOT_FOUND);
    
        return comment;
    }
    
    async create(comment: CommentEntity): Promise<CommentEntity>{
        if (comment.post === null)
            throw new BusinessLogicException("No se encontro el post al que se desea comentar", BusinessError.NOT_FOUND);

        return await this.commentRepository.save(comment);
    }

    async update(commentId: string, comment: CommentEntity): Promise<CommentEntity>{
        const persistedComment: CommentEntity = await this.commentRepository.findOne({where: {id: commentId}, relations: ["post","response"]});
        if (!persistedComment)
            throw new BusinessLogicException("No se encontro el comentario que se desea actualizar", BusinessError.NOT_FOUND);

        return await this.commentRepository.save({...persistedComment, ...comment})
    }

    async delete(id:string){
        const comment: CommentEntity = await this.commentRepository.findOne({where:{id}});
        if (!comment)
            throw new BusinessLogicException("No se encontro el comentario que se desea eliminar", BusinessError.NOT_FOUND);

        await this.commentRepository.remove(comment);
    }
}
