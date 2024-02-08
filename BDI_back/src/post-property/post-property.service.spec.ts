import { Test, TestingModule } from '@nestjs/testing';
import { PostEntity } from '../post/post.entity';
import { PropertyEntity } from '../property/property.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { PostPropertyService } from './post-property.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('PostPropertyService', () => {
  let service: PostPropertyService;
  let postRepository: Repository<PostEntity>;
  let propertyRepository: Repository<PropertyEntity>;
  let post: PostEntity;
  let property: PropertyEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PostPropertyService],
    }).compile();

    service = module.get<PostPropertyService>(PostPropertyService);
    postRepository = module.get<Repository<PostEntity>>(getRepositoryToken(PostEntity));
    propertyRepository = module.get<Repository<PropertyEntity>>(getRepositoryToken(PropertyEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    postRepository.clear();
    propertyRepository.clear();

    post = await postRepository.save({
      price: parseInt(faker.commerce.price(1000, 10000, 0)),
      title: faker.lorem.sentence(),
      images: "",
      tags: "",
      contactPhone: faker.phone.number('+57 31########'),
      description: faker.lorem.paragraph(),
      contractType: faker.helpers.arrayElement(['rent', 'sale']),
    });
      
    property = await propertyRepository.save({
      area: faker.datatype.number({ min: 20, max: 150 }),
      address: faker.address.streetAddress(),
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error if the post is not found when adding a property to a post', async () => {
    await expect(() => service.addPropertyPost("0", property.id)).rejects.toHaveProperty('message', 'Post not found')
  });

  it('should throw an error if the property is not found when adding a property to a post', async () => {
    await expect(() => service.addPropertyPost(post.id, "0")).rejects.toHaveProperty('message', 'Property not found')
  });

  it('should show null if the post has no property', async () => {
    const postWithoutProperty = await postRepository.findOne({ where: {id: post.id}, relations: ['publisher', 'property'] });
    expect(postWithoutProperty.property).toBeNull();
  });

  it('should add a property to a post', async () => {
    await service.addPropertyPost(post.id, property.id);
    const postWithProperty = await postRepository.findOne({ where: {id: post.id}, relations: ['publisher', 'property'] });
    expect(postWithProperty.property).not.toBeNull();
    expect(postWithProperty.property.id).toEqual(property.id);
  });

  it('should throw an error if the post is not found when getting the property of a post', async () => {
    await expect(() => service.findPropertyByPost("0")).rejects.toHaveProperty('message', 'Post not found')
  });

  it('should get the property of a post', async () => {
    await service.addPropertyPost(post.id, property.id);
    const propertyOfPost = await service.findPropertyByPost(post.id);
    expect(propertyOfPost).not.toBeNull();
    expect(propertyOfPost.id).toEqual(property.id);
  });

  it('should throw an error if the post is not found when updating the property of a post', async () => {
    await expect(() => service.updatePropertyPost("0", property.id)).rejects.toHaveProperty('message', 'Post not found')
  });

  it('should throw an error if the property is not found when updating the property of a post', async () => {
    await expect(() => service.updatePropertyPost(post.id, "0")).rejects.toHaveProperty('message', 'Property not found')
  });

  it('should update the property of a post', async () => {
    await service.addPropertyPost(post.id, property.id);
    const newProperty = await propertyRepository.save({
      area: faker.datatype.number({ min: 20, max: 150 }),
      address: faker.address.streetAddress(),
    });
    await service.updatePropertyPost(post.id, newProperty.id);
    const propertyOfPost = await service.findPropertyByPost(post.id);
    expect(propertyOfPost).not.toBeNull();
    expect(propertyOfPost.id).toEqual(newProperty.id);
  });


});
