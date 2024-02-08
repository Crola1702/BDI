import { Test, TestingModule } from '@nestjs/testing';
import { UserPostService } from './user-post.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { PostEntity } from '../post/post.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { UserRole } from '../shared/enums/role.enum';

describe('UserPostService', () => {
  let service: UserPostService;
  let userRepository: Repository<UserEntity>;
  let postRepository: Repository<PostEntity>;
  let user: UserEntity;
  let postsList: PostEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
    imports: [...TypeOrmTestingConfig()],
    providers: [UserPostService],
    }).compile();

    service = module.get<UserPostService>(UserPostService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    postRepository = module.get<Repository<PostEntity>>(getRepositoryToken(PostEntity));
    await seedDatabase();

  });

  const seedDatabase = async () => {
    postRepository.clear();
    userRepository.clear();

    postsList = [];
    for (let i = 0; i < 5; i++) {
      const post: PostEntity = await postRepository.save({
        price: parseInt(faker.commerce.price(1000, 10000, 0)),
        title: faker.commerce.productName(),
        contactPhone: faker.phone.number('+57 31########'),
        description: faker.lorem.paragraph(),
        contractType: faker.helpers.arrayElement(['rent', 'sale']),
      });
      postsList.push(post);
    }

    user = await userRepository.save({
      username: faker.name.fullName(),
      password: faker.internet.password(),
      role: UserRole.SELLER,
      verifiedUser: faker.datatype.boolean(),
      approvedForSale: faker.datatype.boolean(),
      posts: postsList,  
    });
  };


  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('addPostUser should thrown exception for an invalid post', async () => {
    const newUser: UserEntity = await userRepository.save({
      username: faker.name.fullName(),
      password: faker.internet.password(),
      role: UserRole.SELLER,
      verifiedUser: faker.datatype.boolean(),
      approvedForSale: faker.datatype.boolean(),
    });

    await expect(() => service.addPostUser('0', newUser.id)).rejects.toHaveProperty('message', 'The post with the given id was not found');
  });

  it('addPostUser should thrown exception for an invalid user', async () => {
    const newPost: PostEntity = await postRepository.save({
      price: parseInt(faker.commerce.price(1000, 10000, 0)),
      title: faker.commerce.productName(),
      contactPhone: faker.phone.number('+57 31########'),
      description: faker.lorem.paragraph(),
      contractType: faker.helpers.arrayElement(['rent', 'sale']),
    });
    await expect(() => service.addPostUser('0', newPost.id)).rejects.toHaveProperty('message', 'The user with the given id was not found');
  });
  
  it('AddPostUser should add a post to a user', async () => {
    const newPost: PostEntity = await postRepository.save({
      price: parseInt(faker.commerce.price(1000, 10000, 0)),
      title: faker.commerce.productName(),
      contactPhone: faker.phone.number('+57 31########'),
      description: faker.lorem.paragraph(),
      contractType: faker.helpers.arrayElement(['rent', 'sale']),
    });
  
    const newUser: UserEntity = await userRepository.save({
      username: faker.name.fullName(),
      password: faker.internet.password(),
      role: UserRole.SELLER,
      verifiedUser: faker.datatype.boolean(),
      approvedForSale: faker.datatype.boolean(),
    });

    const result: UserEntity = await service.addPostUser(newUser.id, newPost.id);

    expect(result.posts.length).toBe(1);
    expect(result.posts[0]).not.toBeNull();
    expect(result.posts[0].price).toBe(newPost.price);
    expect(result.posts[0].title).toBe(newPost.title);
    expect(result.posts[0].contactPhone).toBe(newPost.contactPhone);
    expect(result.posts[0].description).toBe(newPost.description);
    expect(result.posts[0].contractType).toBe(newPost.contractType);
  });

  it('findPostByUserIdPostId should return a post by user', async () => {
    const post: PostEntity = postsList[0];
    const storedPost: PostEntity = await service.findPostByUserIdPostId(user.id, post.id, );

    expect(storedPost).not.toBeNull();
    expect(storedPost.price).toBe(post.price);
    expect(storedPost.title).toBe(post.title);
    expect(storedPost.contactPhone).toBe(post.contactPhone);
    expect(storedPost.description).toBe(post.description);
    expect(storedPost.contractType).toBe(post.contractType);
  });

  it('findPostByUserIdPostId should thrown exception for an invalid post', async () => {
    await expect(() => service.findPostByUserIdPostId(user.id, '0')).rejects.toHaveProperty('message', 'The post with the given id was not found');
  });

  it('findPostByUserIdPostId should thrown exception for a post not associated to the user', async () => {
    const newPost: PostEntity = await postRepository.save({
      price: parseInt(faker.commerce.price(1000, 10000, 0)),
      title: faker.commerce.productName(),
      contactPhone: faker.phone.number('+57 31########'),
      description: faker.lorem.paragraph(),
      contractType: faker.helpers.arrayElement(['rent', 'sale']),
    });
    await expect(() => service.findPostByUserIdPostId(user.id, newPost.id)).rejects.toHaveProperty('message', 'The post with the given id is not associated to the user');
  });

  it('findPostByUserIdPostId should return posts by user', async () => {
    const posts: PostEntity[] = await service.findPostsByUserId(user.id);
    expect(posts.length).toBe(5);
  });

  it('findPostByUserId should should throw an exception for an invalid user', async () => {
    await expect(() => service.findPostsByUserId('0')).rejects.toHaveProperty('message', 'The user with the given id was not found');
  });

  it('associatePostUser should update posts list for a user', async () => {
    const newPost: PostEntity = await postRepository.save({
      price: parseInt(faker.commerce.price(1000, 10000, 0)),
      title: faker.commerce.productName(),
      contactPhone: faker.phone.number('+57 31########'),
      description: faker.lorem.paragraph(),
      contractType: faker.helpers.arrayElement(['rent', 'sale']),
    });

    const updateUser : UserEntity = await service.associatePostsUser(user.id, [newPost]);
    expect(updateUser.posts.length).toBe(1);
    expect(updateUser.posts[0].price).toBe(newPost.price);
    expect(updateUser.posts[0].title).toBe(newPost.title);
    expect(updateUser.posts[0].contactPhone).toBe(newPost.contactPhone);
    expect(updateUser.posts[0].description).toBe(newPost.description);
    expect(updateUser.posts[0].contractType).toBe(newPost.contractType);
  });

  it('associatePostUser should should throw an exception for an invalid user', async () => {
    const newPost: PostEntity = await postRepository.save({
      price: parseInt(faker.commerce.price(1000, 10000, 0)),
      title: faker.commerce.productName(),
      contactPhone: faker.phone.number('+57 31########'),
      description: faker.lorem.paragraph(),
      contractType: faker.helpers.arrayElement(['rent', 'sale']),
    });

    await expect(() => service.associatePostsUser('0', [newPost])).rejects.toHaveProperty('message', 'The user with the given id was not found');
  });

  it('associatePostUser should should throw an exception for an invalid post', async () => {
    const newPost: PostEntity = postsList[0];
    newPost.id = '0';
    await expect(() => service.associatePostsUser(user.id, [newPost])).rejects.toHaveProperty('message', 'The post with the given id was not found');
  });

  it('deletePostUser should delete a post from a user', async () => {
    const post: PostEntity = postsList[0];
    await service.deletePostFromUser(user.id, post.id);

    const storedUser: UserEntity = await userRepository.findOne({where: {id:user.id},  relations: ['posts'] });
    const deletePost: PostEntity = storedUser.posts.find(p => p.id === post.id);

    expect(deletePost).toBeUndefined();
  });

  it('deletePostUser should should throw an exception for an invalid post', async () => {
    await expect(() => service.deletePostFromUser(user.id, '0')).rejects.toHaveProperty('message', 'The post with the given id was not found');
  });

  it('deletePostUser should should throw an exception for an invalid user', async () => {
    const post: PostEntity = postsList[0];
    await expect(() => service.deletePostFromUser('0', post.id)).rejects.toHaveProperty('message', 'The user with the given id was not found');
  });

  it('deletePostUser should should throw an exception for a non associated post', async () => {
    const newPost: PostEntity = await postRepository.save({
      price: parseInt(faker.commerce.price(1000, 10000, 0)),
      title: faker.commerce.productName(),
      contactPhone: faker.phone.number('+57 31########'),
      description: faker.lorem.paragraph(),
      contractType: faker.helpers.arrayElement(['rent', 'sale']),
    });

    await expect(() => service.deletePostFromUser(user.id, newPost.id)).rejects.toHaveProperty('message', 'The post with the given id is not associated to the user');
  });

});
