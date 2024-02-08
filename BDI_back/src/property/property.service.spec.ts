import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { PropertyEntity } from './property.entity';
import { PropertyService } from './property.service';

describe('PropertyService', () => {
  let service: PropertyService;
  let repository: Repository<PropertyEntity>;
  let propertyList: PropertyEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PropertyService],
    }).compile();

    service = module.get<PropertyService>(PropertyService);
    repository = module.get<Repository<PropertyEntity>>(getRepositoryToken(PropertyEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    propertyList = [];
    for (let i = 0; i < 5; i++) {
      const property: PropertyEntity = await repository.save({
        area: faker.datatype.number({ min: 20, max: 150}),
        address: faker.address.streetAddress(),
      });
      propertyList.push(property);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return an array of properties', async () => {
    const properties: PropertyEntity[] = await service.findAll();
    expect(properties).not.toBeNull();
    expect(properties).toHaveLength(propertyList.length);
  });

  it('findOne should return a property by id', async () => {
    const property: PropertyEntity = await service.findOne(propertyList[0].id);
    expect(property).not.toBeNull();
    expect(property.id).toEqual(propertyList[0].id);
    expect(property.area).toEqual(propertyList[0].area);
  });

  it('findOne should throw an error if property not found', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty('message', 'Property not found')
  });

  it('create should create a new property', async () => {
    const property: PropertyEntity = {
      id: "",
      address: faker.address.streetAddress(),
      area: faker.datatype.number({ min: 20, max: 150}),
      post: null,
      location: null,
    };
    const createdProperty: PropertyEntity = await service.create(property);
    expect(createdProperty).not.toBeNull();
    expect(createdProperty.id).not.toBeNull();
    expect(createdProperty.area).toEqual(property.area);
  });

  it('update should update a property', async () => {
    const property = propertyList[0]
    property.area = 19;
    property.address = faker.address.streetAddress();

    const updatedProperty: PropertyEntity = await service.update(property.id, property);
    expect(updatedProperty).not.toBeNull();

    const storedProperty: PropertyEntity = await repository.findOne({ where: { id: property.id } });
    expect(storedProperty).not.toBeNull();
    expect(storedProperty.area).toEqual(property.area);
  });

  it('update should throw an error if property not found', async () => {
    const property = propertyList[0]
    property.area = 19;
    property.address = faker.address.streetAddress();

    await expect(() => service.update("0", property)).rejects.toHaveProperty('message', 'Property not found')
  });

  it('delete should delete a property', async () => {
    const property = propertyList[0]
    await service.delete(property.id);
    const storedProperty: PropertyEntity = await repository.findOne({ where: { id: property.id } });
    expect(storedProperty).toBeNull();
  });

  it('delete should throw an error if property not found', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty('message', 'Property not found');
  });


});

