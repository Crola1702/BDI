import { Controller, Post, UseInterceptors, Param, Get, Delete, Put, HttpCode } from '@nestjs/common';
import { Roles } from '../shared/security/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { QuestionResponseService } from './question-response.service';
import { Public } from '../shared/security/public.decorator';


@Controller('comments')
@UseInterceptors(BusinessErrorsInterceptor)
export class QuestionResponseController {
    constructor(private readonly questionResponseService: QuestionResponseService) {}

    @Roles('admin', 'user', 'seller')
    @Post(':questionId/:responseId')
    async createQuestionResponse(@Param('questionId') questionId: string, @Param('responseId') responseId: string) {
        return await this.questionResponseService.addQuestionResponse(questionId, responseId);
    }

    @Public()
    @Get(':questionId/:responseId')
    async getQuestionResponse(@Param('questionId') questionId: string, @Param('responseId') responseId: string) {
        return await this.questionResponseService.findReponseByQuestionResponseId(questionId, responseId);
    }

    @Public()
    @Get(':questionId')
    async getQuestionResponses(@Param('questionId') questionId: string) {
        return await this.questionResponseService.findResponseByQuestionId(questionId);
    }

    @Roles('admin', 'user', 'seller')
    @Delete(':questionId/:responseId')
    @HttpCode(204)
    async deleteQuestionResponse(@Param('questionId') questionId: string, @Param('responseId') responseId: string) {
        return await this.questionResponseService.deleteResponseQuestion(questionId, responseId);
    }
}
