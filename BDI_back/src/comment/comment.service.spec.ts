import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';
import { faker } from '@faker-js/faker';
import { PostEntity } from '../post/post.entity';

describe('CommentService', () => {
  let service: CommentService;
  let commentRepository: Repository<CommentEntity>;
  let commentsList: CommentEntity[];
  let postRepository: Repository<PostEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CommentService],
    }).compile();

    service = module.get<CommentService>(CommentService);
    commentRepository = module.get<Repository<CommentEntity>>(getRepositoryToken(CommentEntity));
    postRepository = module.get<Repository<PostEntity>>(getRepositoryToken(PostEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    commentRepository.clear();
    postRepository.clear();

    commentsList = [];
    for (let i = 0; i < 5; i++){
      const comment: CommentEntity = await commentRepository.save({
      comment: faker.lorem.sentence(),
      type: "pregunta"})
      commentsList.push(comment);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all comments', async() =>{
    const comments: CommentEntity[] = await service.findAll()
    expect(comments).not.toBeNull();
    expect(comments).toHaveLength(commentsList.length);
  });

  it('findOne should return a commnet by id', async () => {
    const storedComment: CommentEntity = commentsList[0];
    const comment: CommentEntity = await service.findOne(storedComment.id);
    expect(comment).not.toBeNull();
    expect(comment.comment).toEqual(storedComment.comment);
    expect(comment.type).toEqual(storedComment.type);
  });

  it('finOne whould throw an exception for an invalid comment', async ()=> {
    await expect(()=> service.findOne("0")).rejects.toHaveProperty("message", "No se encontro el comentario")
  });

  it('create should return a new comment', async ()=> {
    const post = new PostEntity();
    post.id = "";
    post.title = faker.lorem.sentence();
    post.images = "image1.jpg"
    post.tags = "mytag"
    post.price = parseInt(faker.commerce.price(1000, 10000, 0));
    post.contactPhone = faker.phone.number('+57 31########');
    post.description = faker.lorem.paragraph();
    post.contractType = faker.helpers.arrayElement(['rent', 'sale']);

    const comment = new CommentEntity();
    comment.comment = faker.lorem.sentence();
    comment.type = "pregunta";
    comment.response = null;
    comment.post = post;

    await postRepository.save(post);

    
    const newComment: CommentEntity = await service.create(comment);
    expect(newComment).not.toBeNull();

    const storedComment: CommentEntity = await commentRepository.findOne({where: {id: newComment.id}});
    expect(storedComment).not.toBeNull();
    expect(storedComment.comment).toEqual(newComment.comment);
    expect(storedComment.type).toEqual(newComment.type);
  });

  it('create should throw an exception for an unexistence of a post', async ()=> {

    const comment: CommentEntity = {
      id: "",
      comment: faker.lorem.sentence(),
      type: "pregunta",
      response: null,
      post: null,
    }
    await expect(()=> service.create(comment)).rejects.toHaveProperty("message", "No se encontro el post al que se desea comentar")
  });

  it('update should modify a comment', async () => {
    const comment: CommentEntity = commentsList[0];
    comment.comment = "este es el nuevo comentario";

    const updatedComment: CommentEntity = await service.update(comment.id, comment);
    expect(updatedComment).not.toBeNull();
  });

  it('update should throw an exception for an invalid comment', async ()=>{
    let comment: CommentEntity = commentsList[0];

    comment = {
      ...comment,comment:"nuevo comentario"
    }
    await expect(()=> service.update("0", comment)).rejects.toHaveProperty("message", "No se encontro el comentario que se desea actualizar")
  });

  it('delete should remove a comment', async () => {
    const comment: CommentEntity = commentsList[0];
    await service.delete(comment.id);
    const deleteComment: CommentEntity = await commentRepository.findOne({where: {id: comment.id}});
    expect(deleteComment).toBeNull();
  });

  it('delete should throw an exception for an invalid comment', async () => {
    const comment: CommentEntity = commentsList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "No se encontro el comentario que se desea eliminar")
  });



});
