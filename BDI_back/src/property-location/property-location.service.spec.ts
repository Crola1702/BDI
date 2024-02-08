import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { LocationEntity } from '../location/location.entity';
import { PropertyEntity } from '../property/property.entity';
import { Repository } from 'typeorm';
import { PropertyLocationService } from './property-location.service';

import { faker } from '@faker-js/faker'

describe('PropertyLocationService', () => {
  let service: PropertyLocationService;
  let propertyRepository: Repository<PropertyEntity>;
  let locationRepository: Repository<LocationEntity>;
  let location: LocationEntity;
  let propertiesList: PropertyEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PropertyLocationService],
    }).compile();

    service = module.get<PropertyLocationService>(PropertyLocationService);
    propertyRepository = module.get<Repository<PropertyEntity>>(getRepositoryToken(PropertyEntity));
    locationRepository = module.get<Repository<LocationEntity>>(getRepositoryToken(LocationEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    propertyRepository.clear();
    locationRepository.clear();

    propertiesList = [];
    for (let i = 0; i < 5; i++) {
      const property = await propertyRepository.save({
        area: faker.datatype.number({ min: 20, max: 150 }),
        address: faker.address.streetAddress(),
      });
      propertiesList.push(property);
    }

    location = await locationRepository.save({
      latitude: parseFloat(faker.address.latitude()),
      longitude: parseFloat(faker.address.longitude()),
      address: faker.address.streetAddress(),
      properties: propertiesList
    });    
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPropertyLocation should set the location of a property', async () => {
    const newLocation: LocationEntity = await locationRepository.save({
      latitude: parseFloat(faker.address.latitude()),
      longitude: parseFloat(faker.address.longitude()),
      address: faker.address.streetAddress(),
    });

    const newProperty: PropertyEntity = await propertyRepository.save({
      area: faker.datatype.number({ min: 20, max: 150 }),
      address: faker.address.streetAddress(),
    });

    const result: PropertyEntity = await service.addPropertyLocation(newProperty.id, newLocation.id);

    expect(result.location).not.toBeNull();
    expect(result.location.latitude).toBe(newLocation.latitude);
    expect(result.location.longitude).toBe(newLocation.longitude);
    expect(result.location.address).toBe(newLocation.address);
  });

  it('addPropertyLocation should throw an exception for an invalid location', async () => {
    const newProperty: PropertyEntity = await propertyRepository.save({
      area: faker.datatype.number({ min: 20, max: 150 }),
      address: faker.address.streetAddress(),
    });

    await expect(() => service.addPropertyLocation(newProperty.id, '0')).rejects.toHaveProperty('message', 'The location with the given id was not found');
  });
  
  it('addPropertyLocation should throw an exception for an invalid property', async () => {
    const newLocation: LocationEntity = await locationRepository.save({
      latitude: parseFloat(faker.address.latitude()),
      longitude: parseFloat(faker.address.longitude()),
      address: faker.address.streetAddress(),
    });

    await expect(() => service.addPropertyLocation('0', newLocation.id)).rejects.toHaveProperty('message', 'The property with the given id was not found');
  });

  it('findLocationByPropertyId should return the location of a property', async () => {
    const storedLocation: LocationEntity = await service.findLocationByPropertyId(propertiesList[0].id);
    expect(storedLocation).not.toBeNull();
    expect(storedLocation.latitude).toBe(location.latitude);
    expect(storedLocation.longitude).toBe(location.longitude);
    expect(storedLocation.address).toBe(location.address);
    });

  it('findLocationByPropertyId should throw an exception for an invalid property', async () => {
    await expect(() => service.findLocationByPropertyId('0')).rejects.toHaveProperty('message', 'The property with the given id was not found');
  });

  it('findPropertiesByLocationId should return the properties of a location', async () => {
    const storedProperties: PropertyEntity[] = await service.findPropertiesByLocationId(location.id);
    expect(storedProperties).not.toBeNull();
    expect(storedProperties.length).toBe(5);

    for (let i = 0; i < 5; i++) {
      expect(storedProperties[i].id).toBe(propertiesList[i].id);
      expect(storedProperties[i].area).toBe(propertiesList[i].area);
      expect(storedProperties[i].address).toBe(propertiesList[i].address);
    }
  });

  it('findPropertiesByLocationId should throw an exception for an invalid location', async () => {
    await expect(() => service.findPropertiesByLocationId('0')).rejects.toHaveProperty('message', 'The location with the given id was not found');
  });

  it('findPropertyByLocationIdPropertyId should return a property from a location', async () => {
    const property: PropertyEntity = propertiesList[0];
    const storedProperty: PropertyEntity = await service.findPropertyByLocationIdPropertyId(location.id, property.id);
    expect(storedProperty).not.toBeNull();
    expect(storedProperty.id).toBe(property.id);
    expect(storedProperty.area).toBe(property.area);
    expect(storedProperty.address).toBe(property.address);
  });

  it('findPropertyByLocationIdPropertyId should throw an exception for an invalid location', async () => {
    const property: PropertyEntity = propertiesList[0];
    await expect(() => service.findPropertyByLocationIdPropertyId('0', property.id)).rejects.toHaveProperty('message', 'The location with the given id was not found');
  });

  it('findPropertyByLocationIdPropertyId should throw an exception for an invalid property', async () => {
    await expect(() => service.findPropertyByLocationIdPropertyId(location.id, '0')).rejects.toHaveProperty('message', 'The property with the given id was not found');
  });

  it('findPropertyByLocationIdPropertyId should throw an exception for a property not in the location', async () => {
    const newProperty: PropertyEntity = await propertyRepository.save({
      area: faker.datatype.number({ min: 20, max: 150 }),
      address: faker.address.streetAddress(),
    });

    await expect(() => service.findPropertyByLocationIdPropertyId(location.id, newProperty.id)).rejects.toHaveProperty('message', 'The property with the given id is not associated to the location');
  });

  it('deletePropertyLocation should remove a property from a location', async () => {
    const property: PropertyEntity = propertiesList[0];

    await service.deletePropertyLocation(location.id, property.id);

    const storedLocation: LocationEntity = await locationRepository.findOne({where: {id: location.id}, relations: ['properties'] });
    const deletedProperty: PropertyEntity = storedLocation.properties.find(p => p.id === property.id);
    expect(deletedProperty).toBeUndefined();
  });

  it('deletePropertyLocation should throw an exception for an invalid location', async () => {
    const property: PropertyEntity = propertiesList[0];

    await expect(() => service.deletePropertyLocation('0', property.id)).rejects.toHaveProperty('message', 'The location with the given id was not found');
  });

  it('deletePropertyLocation should throw an exception for an invalid property', async () => {
    await expect(() => service.deletePropertyLocation(location.id, '0')).rejects.toHaveProperty('message', 'The property with the given id was not found');
  });

  it('deletePropertyLocation should throw an exception for a property not associated to the location', async () => {
    const newProperty: PropertyEntity = await propertyRepository.save({
      area: faker.datatype.number({ min: 20, max: 150 }),
      address: faker.address.streetAddress(),
    });

    await expect(() => service.deletePropertyLocation(location.id, newProperty.id)).rejects.toHaveProperty('message', 'The property with the given id is not associated to the location');
  });
  
});
