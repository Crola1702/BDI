import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../comment/comment.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionResponseService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly questionRepository: Repository<CommentEntity>,

        @InjectRepository(CommentEntity)
        private readonly responseRepository: Repository<CommentEntity>
    ) {}

    async addQuestionResponse(questiontId: string, responseId: string): Promise<CommentEntity>{
        const response: CommentEntity = await this.responseRepository.findOne({where: {id : responseId}, relations : ['post']});
        if (!response)
            throw new BusinessLogicException("No se encontro la respuesta", BusinessError.NOT_FOUND);

        const question: CommentEntity = await this.questionRepository.findOne({where : {id : questiontId}, relations : ['post','response']});
        if (!question)
            throw new BusinessLogicException("No se encontro la pregunta", BusinessError.NOT_FOUND);

        question.response = response;
        return await this.questionRepository.save(question);
    }

    async findReponseByQuestionResponseId(questiontId: string, responseId: string): Promise<CommentEntity>{
        const response: CommentEntity = await this.responseRepository.findOne({where: {id : responseId}, relations : ['post']});
        if (!response)
            throw new BusinessLogicException("No se encontro la respuesta", BusinessError.NOT_FOUND);

        const question: CommentEntity = await this.questionRepository.findOne({where : {id : questiontId}, relations : ['post','response']});
        if (!question)
            throw new BusinessLogicException("No se encontro la pregunta", BusinessError.NOT_FOUND);
    
        const responseQuestion: CommentEntity = question.response;
        if (responseQuestion.id !== response.id)
            throw new BusinessLogicException("La pregunta no tiene respuesta", BusinessError.PRECONDITION_FAILED);
        
        return responseQuestion;
    }

    async findResponseByQuestionId(questiontId: string): Promise<CommentEntity> {
        const question: CommentEntity = await this.questionRepository.findOne({where : {id : questiontId}, relations : ['post','response']});
        if (!question)
            throw new BusinessLogicException("No se encontro la pregunta", BusinessError.NOT_FOUND);

        return question.response
    }

    async deleteResponseQuestion(questiontId: string, responseId: string){
        const response: CommentEntity = await this.responseRepository.findOne({where: {id : responseId}, relations : ['post']});
        if (!response)
            throw new BusinessLogicException("No se encontro la respuesta", BusinessError.NOT_FOUND);

        const question: CommentEntity = await this.questionRepository.findOne({where : {id : questiontId}, relations : ['post','response']});
        if (!question)
            throw new BusinessLogicException("No se encontro la pregunta", BusinessError.NOT_FOUND);
    
        const responseQuestion: CommentEntity = question.response
        if (!(responseQuestion.id === response.id))
            throw new BusinessLogicException("La pregunta no tiene respuesta", BusinessError.PRECONDITION_FAILED);

        question.response = undefined;
        await this.responseRepository.clear();
        await this.questionRepository.save(question);
    }
}
