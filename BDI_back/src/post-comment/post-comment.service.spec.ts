import { Test, TestingModule } from '@nestjs/testing';
import { CommentEntity } from '../comment/comment.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PostEntity } from '../post/post.entity';
import { Repository } from 'typeorm';
import { PostCommentService } from './post-comment.service';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PostCommentService', () => {
  let service: PostCommentService;
  let postRepository: Repository<PostEntity>;
  let commentRepository: Repository<CommentEntity>;
  let post: PostEntity;
  let commentsList: CommentEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PostCommentService],
    }).compile();

    service = module.get<PostCommentService>(PostCommentService);
    postRepository = module.get<Repository<PostEntity>>(getRepositoryToken(PostEntity));
    commentRepository = module.get<Repository<CommentEntity>>(getRepositoryToken(CommentEntity));

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

    post = await postRepository.save({
      price: parseInt(faker.commerce.price(1000, 10000, 0)),
      title: faker.lorem.sentence(),
      images: "",
      tags: "",
      contactPhone: faker.phone.number('+57 31########'),
      description: faker.lorem.paragraph(),
      contractType: faker.helpers.arrayElement(['rent', 'sale']),
      comments: commentsList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCommentPost should add a comment to a post', async ()=> {
    const newComment: CommentEntity = await commentRepository.save({
      comment: faker.lorem.sentence(),
      type: "pregunta",
    });

    const newPost: PostEntity = await postRepository.save ({
      price: 1000,
      title: faker.lorem.sentence(),
      images: "",
      tags: "",
      contactPhone: faker.phone.number('+57 31########'),
      description: faker.lorem.paragraph(),
      contractType: faker.helpers.arrayElement(['rent', 'sale'])
    });

    const result: PostEntity = await service.addCommentPost(newPost.id, newComment.id);

    expect(result.comments.length).toBe(1);
    expect(result.comments[0]).not.toBeNull();
    expect(result.comments[0].comment).toBe(newComment.comment);
    expect(result.comments[0].type).toBe(newComment.type);
  });

  it('addCommentPost should throw an exception for an invalid comment', async () => {
    const newPost: PostEntity = await postRepository.save ({
      price: 1000,
      title: faker.lorem.sentence(),
      images: "",
      tags: "",
      contactPhone: faker.phone.number('+57 31########'),
      description: faker.lorem.paragraph(),
      contractType: faker.helpers.arrayElement(['rent', 'sale'])
    });
    await expect(() => service.addCommentPost(newPost.id, "0")).rejects.toHaveProperty("message", "No se encontro el comentario");
  });

  it('addCommentPost should throw an exception for an invalid post', async () => {
    const newComment: CommentEntity = await commentRepository.save({
      comment: faker.lorem.sentence(),
      type: "pregunta",
    });

    await expect(() => service.addCommentPost("0", newComment.id)).rejects.toHaveProperty("message", "No se encontro la publicacion");
  });

  it('findCommentByPostIdCommentId should return comment by post', async () => {
    const comment: CommentEntity = commentsList[0];
    const storedComment: CommentEntity = await service.findCommentByPostIdCommentId(post.id, comment.id);
    expect(storedComment).not.toBeNull;
    expect(storedComment.comment).toBe(comment.comment);
    expect(storedComment.type).toBe(comment.type);
  });

  it('findCommentByPostIdCommentId should throw an expection for an invalid comment', async () =>{
    await expect(() => service.findCommentByPostIdCommentId(post.id, "0")).rejects.toHaveProperty("message", "No se encontro el comentario");
  });

  it('findCommentByPostIdCommentId should throw an expection for an invalid post', async () =>{
    const comment: CommentEntity = commentsList[0];
    await expect(() => service.findCommentByPostIdCommentId("0", comment.id)).rejects.toHaveProperty("message", "No se encontro la publicacion");
  });

  it ('findCommentByPostIdCommentId should throw an expection for an comment not associated to the post', async () =>{
    const newcomment: CommentEntity = await commentRepository.save({
      comment: faker.lorem.sentence(),
      type: "pregunta",
    });

    await expect(() => service.findCommentByPostIdCommentId(post.id, newcomment.id)).rejects.toHaveProperty("message", "El comentario no está asociado a la publicacion")

  });

  it('findCommentsByPostId should return comments bu museum', async () => {
    const comments: CommentEntity[] = await service.findCommentsByPostId(post.id);
    expect(comments.length).toBe(5);
  });

  it('findCommentsByPostId should throw an exception for an invalid post', async () => {
    await expect(() => service.findCommentsByPostId("0")).rejects.toHaveProperty("message", "No se encontro la publicacion");
  });

  it('associateCommentPost should update the comments list of a post', async () => {
    const newComment: CommentEntity = await commentRepository.save({
      comment: faker.lorem.sentence(),
      type: "pregunta",
    });

    const updatePost: PostEntity = await service.associateCommentPost(post.id, [newComment]);
    expect(updatePost.comments.length).toBe(1);
    expect(updatePost.comments[0].comment).toBe(newComment.comment);
    expect(updatePost.comments[0].type).toBe(newComment.type);
  });

  it('associateCommentPost should throw ann exception for an invlaid post', async () => {
    const newComment: CommentEntity = await commentRepository.save({
      comment: faker.lorem.sentence(),
      type: "pregunta",
    });
    await expect(() => service.associateCommentPost("0",[newComment])).rejects.toHaveProperty("message", "No se encontro la publicacion");
  });

  it('associateCommentPost should throw ann exception for an invlaid comment', async () => {
    const newComment: CommentEntity = commentsList[0];
    newComment.id = "0";

    await expect(() => service.associateCommentPost(post.id,[newComment])).rejects.toHaveProperty("message", "No se encontro el comentario");
  });

  it('deleteCommentPost should remove a comment from a post', async () => {
    const comment: CommentEntity = commentsList[0];

    await service.deleteCommentPost(post.id, comment.id);

    const storedPost: PostEntity = await postRepository.findOne({where: {id: post.id}, relations : ['publisher', 'property','comments']});
    const deletedComment: CommentEntity = storedPost.comments.find(a => a.id === comment.id)

    expect(deletedComment).toBeUndefined();
  });

  it('deleteCommentPost should throw an exception for an invalid comment', async () => {
    await expect(() => service.deleteCommentPost(post.id, "0")).rejects.toHaveProperty("message", "No se encontro el comentario");
  });

  it('deleteCommentPost should throw an exception for an invalid post', async () => {
    const comment: CommentEntity = commentsList[0];
    await expect(() => service.deleteCommentPost("0", comment.id)).rejects.toHaveProperty("message", "No se encontro la publicacion");
  });

  it('deleteCommentPost should throw an exception for a non associated comment', async () => {
    const newComment: CommentEntity = await commentRepository.save({
      comment: faker.lorem.sentence(),
      type: "pregunta",
    });

    await expect(() => service.deleteCommentPost(post.id, newComment.id)).rejects.toHaveProperty("message", "El comentario no está asociado a la publicacion");
  });
  
    
});
