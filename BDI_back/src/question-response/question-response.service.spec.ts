import { Test, TestingModule } from '@nestjs/testing';
import { CommentEntity } from '../comment/comment.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { QuestionResponseService } from './question-response.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('QuestionResponseService', () => {
  let service: QuestionResponseService;
  let questionRepository: Repository<CommentEntity>;
  let responseRepository: Repository<CommentEntity>;
  let question: CommentEntity;
  let response: CommentEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [QuestionResponseService],
    }).compile();

    service = module.get<QuestionResponseService>(QuestionResponseService);
    questionRepository = module.get<Repository<CommentEntity>>(getRepositoryToken(CommentEntity));
    responseRepository = module.get<Repository<CommentEntity>>(getRepositoryToken(CommentEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    questionRepository.clear();
    responseRepository.clear();

    response = await responseRepository.save({
      comment: faker.lorem.sentence(),
      type: "respuesta"
    });

    question = await questionRepository.save({
      comment: faker.lorem.sentence(),
      type: "pregunta",
      response: response
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addQuestionResponse should add a response to a question', async ()=> {
    const newResponse: CommentEntity = await responseRepository.save({
      comment: faker.lorem.sentence(),
      type: "respuesta",
    });

    const newQuestion: CommentEntity = await questionRepository.save({
      comment: faker.lorem.sentence(),
      type: "pregunta",
    });

    const result: CommentEntity = await service.addQuestionResponse(newQuestion.id, newResponse.id);

    expect(result).not.toBeNull();
    expect(result.response).not.toBeNull();
    expect(result.response.comment).toBe(newResponse.comment);
    expect(result.response.type).toBe(newResponse.type);
  });

  it('addQuestionResponse should throw an exception for an invalid response', async () => {
    const newQuestion: CommentEntity = await questionRepository.save({
      comment: faker.lorem.sentence(),
      type: "pregunta",
    });

    await expect(() => service.addQuestionResponse(newQuestion.id, "0")).rejects.toHaveProperty("message", "No se encontro la respuesta");
  });

  it('addQuestionResponse should throw an exception for an invalid question', async () => {
    const newResponse: CommentEntity = await responseRepository.save({
      comment: faker.lorem.sentence(),
      type: "respuesta",
    });

    await expect(() => service.addQuestionResponse("0", newResponse.id)).rejects.toHaveProperty("message", "No se encontro la pregunta");
  });

  it('findReponseByQuestionResponseId should return response by question', async () => {

    const storedResponse: CommentEntity = await service.findReponseByQuestionResponseId(question.id, response.id);
    expect(storedResponse).not.toBeNull;
    expect(storedResponse.comment).toBe(response.comment);
    expect(storedResponse.type).toBe(response.type);
  });

  it('findReponseByQuestionResponseId should throw an expection for an invalid response', async () =>{
    await expect(() => service.findReponseByQuestionResponseId(question.id, "0")).rejects.toHaveProperty("message", "No se encontro la respuesta");
  });

  it('findReponseByQuestionResponseId should throw an expection for an invalid question', async () =>{
    await expect(() => service.findReponseByQuestionResponseId("0", response.id)).rejects.toHaveProperty("message", "No se encontro la pregunta");
  });

  it ('findReponseByQuestionResponseId should throw an expection for an comment not associated to the post', async () =>{
    const newResponse: CommentEntity = await responseRepository.save({
      comment: faker.lorem.sentence(),
      type: "respuesta",
    });

    await expect(() => service.findReponseByQuestionResponseId(question.id, newResponse.id)).rejects.toHaveProperty("message", "La pregunta no tiene respuesta")

  });

  it('findResponseByQuestionId should return response by question', async () => {
    const responsefound: CommentEntity = await service.findResponseByQuestionId(question.id);
    expect(response).not.toBeNull;
    expect(responsefound.comment).toBe(response.comment);
    expect(responsefound.type).toBe(response.type);
  });

  it('findResponseByQuestionId should throw an exception for an invalid question', async () => {
    await expect(() => service.findResponseByQuestionId("0")).rejects.toHaveProperty("message", "No se encontro la pregunta");
  });

  it('deleteResponseQuestion should remove a response from a question', async () => {

    await service.deleteResponseQuestion(question.id, response.id);
    const deletedReponse: CommentEntity = await questionRepository.findOne({where: {id: question.id}, relations : ['post','response']});

    expect(deletedReponse.response).toBeNull();
  });

  it('deleteResponseQuestion should throw an exception for an invalid response', async () => {
    await expect(() => service.deleteResponseQuestion(question.id, "0")).rejects.toHaveProperty("message", "No se encontro la respuesta");
  });

  it('deleteResponseQuestion should throw an exception for an invalid question', async () => {
    await expect(() => service.deleteResponseQuestion("0", response.id)).rejects.toHaveProperty("message", "No se encontro la pregunta");
  });

  it('deleteResponseQuestion should throw an exception for a non associated response', async () => {
    const newResponse: CommentEntity = await responseRepository.save({
      comment: faker.lorem.sentence(),
      type: "respuesta",
    });

    await expect(() => service.deleteResponseQuestion(question.id, newResponse.id)).rejects.toHaveProperty("message", "La pregunta no tiene respuesta");
  });

});
