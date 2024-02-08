import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { LocationEntity } from './location.entity';
import { LocationService } from './location.service';

import { faker } from '@faker-js/faker';

describe('LocationService', () => {
  let service: LocationService;
  let repository: Repository<LocationEntity>;
  let locationsList: LocationEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [LocationService],
    }).compile();

    service = module.get<LocationService>(LocationService);
    repository = module.get<Repository<LocationEntity>>(getRepositoryToken(LocationEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    locationsList = [];
    for (let i = 0; i < 5; i++) {
      const location: LocationEntity = await repository.save({
        latitude: parseFloat(faker.address.latitude()),
        longitude: parseFloat(faker.address.longitude()),
        address: faker.address.streetAddress(),
      });
      locationsList.push(location);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all locations', async () => {
    const locations: LocationEntity[] = await service.findAll();
    expect(locations).not.toBeNull();
    expect(locations).toHaveLength(locationsList.length);
  });

  it('findOne should return a location by id', async () => {
    const storedLocation: LocationEntity = locationsList[0];
    const location: LocationEntity = await service.findOne(storedLocation.id);
    expect(location).not.toBeNull();
    expect(location.latitude).toEqual(storedLocation.latitude)
    expect(location.longitude).toEqual(storedLocation.longitude)
    expect(location.address).toEqual(storedLocation.address)
  });

  it('findOne should throw an exception for an invalid location', async () => {
    await expect(service.findOne('0')).rejects.toHaveProperty('message', 'The location with the given id was not found');
  });

  it('create should return a new location', async () => {
    const location: LocationEntity = {
      id: "",
      latitude: parseFloat(faker.address.latitude()),
      longitude: parseFloat(faker.address.longitude()),
      address: faker.address.streetAddress(),
      properties: []
    };

    const newLocation: LocationEntity = await service.create(location);
    expect(newLocation).not.toBeNull();

    const storedLocation: LocationEntity = await repository.findOne({where: {id: newLocation.id}});
    expect(storedLocation).not.toBeNull();
    expect(storedLocation.latitude).toEqual(newLocation.latitude)
    expect(storedLocation.longitude).toEqual(newLocation.longitude)
    expect(storedLocation.address).toEqual(newLocation.address)
    });

    it('update should modify a location', async () => {
      const location: LocationEntity = locationsList[0];
      location.latitude = parseFloat(faker.address.latitude());
      location.longitude = parseFloat(faker.address.longitude());
      const updatedLocation: LocationEntity = await service.update(location.id, location);
      expect(updatedLocation).not.toBeNull();
      const storedLocation: LocationEntity = await repository.findOne({where: {id: location.id}});
      expect(storedLocation).not.toBeNull();
      expect(storedLocation.latitude).toEqual(location.latitude)
      expect(storedLocation.longitude).toEqual(location.longitude)
    });

    it('update should throw an exception for an invalid location', async () => {
      let location: LocationEntity = locationsList[0];
      location = {
        ...location,
        latitude: parseFloat(faker.address.latitude()),
        longitude: parseFloat(faker.address.longitude()),
      }
      await expect(() => service.update('0', location)).rejects.toHaveProperty('message', 'The location with the given id was not found');
    });

    it('delete should remove a location', async () => {
      const location: LocationEntity = locationsList[0];
      await service.delete(location.id);
      const deletedLocation: LocationEntity = await repository.findOne({where: {id: location.id}});
      expect(deletedLocation).toBeNull();
    });

    it('delete should throw an exception for an invalid location', async () => {
      await expect(() => service.delete('0')).rejects.toHaveProperty('message', 'The location with the given id was not found');
    });

});
