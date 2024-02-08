import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { faker } from '@faker-js/faker';
import { UserRole } from '../shared/enums/role.enum';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;
  let usersList: UserEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll shoudl return all users', async () => {
    const users: UserEntity[] = await service.findAll();
    expect(users).not.toBeNull();
    expect(users).toHaveLength(usersList.length);
  });

  it('findOne should return a user by id', async () => {
    const storedUser: UserEntity = usersList[0];
    const user: UserEntity = await service.findOne(storedUser.id);
    expect(user).not.toBeNull();
    expect(user.username).toEqual(storedUser.username);
    expect(user.password).toEqual(storedUser.password);
    expect(user.verifiedUser).toEqual(storedUser.verifiedUser);
    expect(user.approvedForSale).toEqual(storedUser.approvedForSale);
  });

  it('findOne should throw an exception for an invalid user', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('create should throw an exception for an existing user', async () => {
    const user: UserEntity = usersList[0];
    await expect(() => service.create(user)).rejects.toHaveProperty(
      'message',
      'The user with the given username already exists',
    );
  });

  it('create should throw an exception for an invalid role', async () => {
    const user: UserEntity = {
      id: '',
      username: faker.name.fullName(),
      password: faker.internet.password(),
      verifiedUser: faker.datatype.boolean(),
      approvedForSale: faker.datatype.boolean(),
      role: 'invalid',
      posts: [],
    };
    await expect(() => service.create(user)).rejects.toHaveProperty(
      'message',
      'The user role is invalid',
    );
  });

  it('create should create a new user', async () => {
    const user: UserEntity = {
      id: '',
      username: faker.name.fullName(),
      password: faker.internet.password(),
      verifiedUser: faker.datatype.boolean(),
      approvedForSale: faker.datatype.boolean(),
      role: UserRole.USER,
      posts: [],
    };
    const createdUser: UserEntity = await service.create(user);
    expect(createdUser).not.toBeNull();

    const storedUser: UserEntity = await repository.findOne({
      where: { id: createdUser.id },
    });
    expect(storedUser).not.toBeNull();
    expect(storedUser.username).toEqual(user.username);
    expect(storedUser.password).toEqual(user.password);
    expect(storedUser.verifiedUser).toEqual(user.verifiedUser);
    expect(storedUser.approvedForSale).toEqual(user.approvedForSale);
  });

  it('update should update an existing user', async () => {
    const user: UserEntity = usersList[0];
    user.username = 'Juan Ariza';
    user.verifiedUser = true;
    const updatedUser: UserEntity = await service.update(user.id, user);
    expect(updatedUser).not.toBeNull();
    const storedUser: UserEntity = await repository.findOne({
      where: { id: user.id },
    });
    expect(storedUser).not.toBeNull();
    expect(storedUser.username).toEqual(user.username);
    expect(storedUser.password).toEqual(user.password);
    expect(storedUser.verifiedUser).toEqual(user.verifiedUser);
  });

  it('update should throw an exception for an invalid user', async () => {
    let user: UserEntity = usersList[0];
    user = {
      ...user,
      username: 'Pedro Ariza',
      verifiedUser: false,
    };
    await expect(() => service.update('0', user)).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('delete should delete an existing user', async () => {
    const user: UserEntity = usersList[0];
    await service.delete(user.id);
    const deleteUser: UserEntity = await repository.findOne({
      where: { id: user.id },
    });
    expect(deleteUser).toBeNull();
  });

  it('delete should throw an exception for an invalid user', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  const seedDatabase = async () => {
    repository.clear();
    usersList = [];
    for (let i = 0; i < 5; i++) {
      const user: UserEntity = await repository.save({
        username: faker.name.fullName(),
        password: faker.internet.password(),
        role: UserRole.USER,
        verifiedUser: faker.datatype.boolean(),
        approvedForSale: faker.datatype.boolean(),
      });
      usersList.push(user);
    }
  };
});
