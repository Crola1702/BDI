import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PostEntity } from './post.entity';
import { PostService } from './post.service';
import { faker } from '@faker-js/faker';
import { ContractType } from '../shared/enums/contract-type.enum';

describe('PostService', () => {
  let service: PostService;
  let repository: Repository<PostEntity>;
  let postList: PostEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PostService],
    }).compile();

    service = module.get<PostService>(PostService);
    repository = module.get<Repository<PostEntity>>(getRepositoryToken(PostEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    postList = [];
    for (let i = 0; i < 5; i++) {
      const post: PostEntity = await repository.save({
        price: parseInt(faker.commerce.price(1000, 10000, 0)),
        title: faker.lorem.sentence(),
        images: "",
        tags: "",
        contactPhone: faker.phone.number('+57 31########'),
        description: faker.lorem.paragraph(),
        contractType: faker.helpers.arrayElement(Object.values(ContractType)),
      });
      postList.push(post);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return an array of posts', async () => {
    const posts: PostEntity[] = await service.findAll();
    expect(posts).not.toBeNull();
    expect(posts).toHaveLength(postList.length);
  });

  it('findOne should return a post by id', async () => {
    const post: PostEntity = await service.findOne(postList[0].id);
    expect(post).not.toBeNull();
    expect(post.id).toEqual(postList[0].id);
    expect(post.price).toEqual(postList[0].price);
    expect(post.title).toEqual(postList[0].title);
    expect(post.contactPhone).toEqual(postList[0].contactPhone);
  });

  it('findOne should throw an error if post not found', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty('message', 'Post not found');
  });

  it('create should throw an error if contract type is invalid', async () => {
    const post: PostEntity = {
      id: "",
      price: parseInt(faker.commerce.price(1000, 10000, 0)),
      title: faker.lorem.sentence(),
      images: "",
      tags: "",
      contactPhone: faker.phone.number('+57 31########'),
      description: faker.lorem.paragraph(),
      contractType: "free",
      publisher: null,
      property: null,
      comments: [],
    };

    await expect(() => service.create(post)).rejects.toHaveProperty('message', 'Invalid contract type');
  });

  it('create should create a new post', async () => {
    const post: PostEntity = {
      id: "",
      price: parseInt(faker.commerce.price(1000, 10000, 0)),
      title: faker.lorem.sentence(),
      images: "",
      tags: "",
      contactPhone: faker.phone.number('+57 31########'),
      description: faker.lorem.paragraph(),
      contractType: faker.helpers.arrayElement(Object.values(ContractType)),
      publisher: null,
      property: null,
      comments: [],
    };

    const newPost: PostEntity = await service.create(post);
    expect(post).not.toBeNull();

    const storedPost: PostEntity = await service.findOne(newPost.id);
    expect(storedPost).not.toBeNull();
    expect(storedPost.price).toEqual(newPost.price);
    expect(storedPost.title).toEqual(newPost.title);
    expect(storedPost.contactPhone).toEqual(newPost.contactPhone);
    expect(storedPost.description).toEqual(newPost.description);
    expect(storedPost.contractType).toEqual(newPost.contractType);
  });

  it('update should update a post', async () => {
    const post = postList[0];
    post.price = 999;
    post.title = faker.lorem.sentence();
    post.images = "image1.jpg"
    post.tags = "mytag"
    post.contactPhone = faker.phone.number('+57 30########');

    const updatedPost: PostEntity = await service.update(post.id, post);
    expect(updatedPost).not.toBeNull();

    const storedPost: PostEntity = await repository.findOne({ where: { id: post.id } })
    expect(storedPost).not.toBeNull();
    expect(storedPost.price).toEqual(post.price);
    expect(storedPost.title).toEqual(post.title);
    expect(storedPost.contactPhone).toEqual(post.contactPhone);
  });

  it('update should throw an error if post not found', async () => {
    const post = postList[0];
    post.price = 200
    post.title = "title"
    post.images = "image1.jpg"
    post.tags = "mytag"
    post.contactPhone = "123"
    await expect(() => service.update("0", post)).rejects.toHaveProperty('message', 'Post not found');
  });

  it('delete should delete a post', async () => {
    const post = postList[0];
    await service.delete(post.id);
    const deletedPost: PostEntity = await repository.findOne({ where: { id: post.id } });
    expect(deletedPost).toBeNull();
  });

  it('delete should throw an error if post not found', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty('message', 'Post not found');
  });

});
