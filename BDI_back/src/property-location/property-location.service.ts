import { Injectable, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyEntity } from '../property/property.entity';
import { LocationEntity } from '../location/location.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';


@Injectable()
export class PropertyLocationService {
    constructor(
        @InjectRepository(PropertyEntity)
        private readonly propertyRepository: Repository<PropertyEntity>,

        @InjectRepository(LocationEntity)
        private readonly locationRepository: Repository<LocationEntity>,

    ){}

    async addPropertyLocation(propertyId: string, locationId: string): Promise<PropertyEntity> {
        const location: LocationEntity = await this.locationRepository.findOne({where: {id: locationId}, relations: ['properties']});
        if (!location) 
            throw new BusinessLogicException("The location with the given id was not found", BusinessError.NOT_FOUND);
        
        const property: PropertyEntity = await this.propertyRepository.findOne({where: {id: propertyId}, relations: ['location']})
        if (!property)
            throw new BusinessLogicException("The property with the given id was not found", BusinessError.NOT_FOUND);
        
        location.properties = [...location.properties, property];
        property.location = location;
        return await this.propertyRepository.save(property);
    }

    // TODO: Can I have this method here? Or should I create another module and service?
    async findLocationByPropertyId(propertyId: string): Promise<LocationEntity> {
        const property: PropertyEntity = await this.propertyRepository.findOne({where: {id: propertyId}, relations: ['location']})
        if (!property)
            throw new BusinessLogicException("The property with the given id was not found", BusinessError.NOT_FOUND);
        
        return property.location;
    }

    async findPropertiesByLocationId(locationId: string): Promise<PropertyEntity[]> {
        const location: LocationEntity = await this.locationRepository.findOne({where: {id: locationId}, relations: ['properties']})
        if (!location)
            throw new BusinessLogicException("The location with the given id was not found", BusinessError.NOT_FOUND);
        
        return location.properties;
    }

    async findPropertyByLocationIdPropertyId(locationId: string, propertyId: string): Promise<PropertyEntity> { 
        const property: PropertyEntity = await this.propertyRepository.findOne({where: {id: propertyId}, relations: ['location']})
        if (!property)
            throw new BusinessLogicException("The property with the given id was not found", BusinessError.NOT_FOUND);

        const location: LocationEntity = await this.locationRepository.findOne({where: {id: locationId}, relations: ['properties']})
        if (!location)
            throw new BusinessLogicException("The location with the given id was not found", BusinessError.NOT_FOUND);
        
        const locationProperty: PropertyEntity = location.properties.find(p => p.id === propertyId);
        if (!locationProperty)
            throw new BusinessLogicException("The property with the given id is not associated to the location", BusinessError.NOT_FOUND);
        
        return locationProperty;
    }

    async associatePropertiesLocation(locationId: string, properties: PropertyEntity[]): Promise<LocationEntity> {
        const location: LocationEntity = await this.locationRepository.findOne({where: {id: locationId}, relations: ['properties']})
        if (!location)
            throw new BusinessLogicException("The location with the given id was not found", BusinessError.NOT_FOUND);
        
        for (let i=0; i<properties.length; i++){
            const property: PropertyEntity = await this.propertyRepository.findOne({where: {id: properties[i].id}, relations: ['location']})
            if (!property)
                throw new BusinessLogicException("The property with the given id was not found", BusinessError.NOT_FOUND);
        }
        location.properties = properties;
        return await this.locationRepository.save(location);
    }

    async deletePropertyLocation(locationId: string, propertyId: string, ): Promise<LocationEntity> {
        const property: PropertyEntity = await this.propertyRepository.findOne({where: {id: propertyId}})
        if (!property)
            throw new BusinessLogicException("The property with the given id was not found", BusinessError.NOT_FOUND);
        
        const location: LocationEntity = await this.locationRepository.findOne({where: {id: locationId}, relations: ['properties']})
        if (!location)
            throw new BusinessLogicException("The location with the given id was not found", BusinessError.NOT_FOUND);
        
        const locationProperty: PropertyEntity = location.properties.find(p => p.id === propertyId);
        if (!locationProperty)
            throw new BusinessLogicException("The property with the given id is not associated to the location", BusinessError.PRECONDITION_FAILED);

        location.properties = location.properties.filter(p => p.id !== propertyId);
        property.location = null;
        await this.propertyRepository.save(property);
        return await this.locationRepository.save(location);
    }

}
