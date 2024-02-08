import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { LocationEntity } from './location.entity';

@Injectable()
export class LocationService {
    constructor(
        @InjectRepository(LocationEntity)
        private readonly locationRepository: Repository<LocationEntity>,
    ){}

    async findAll(): Promise<LocationEntity[]> {
        return await this.locationRepository.find({relations: ['properties']});
    }

    async findOne(id: string): Promise<LocationEntity> {
        const location: LocationEntity = await this.locationRepository.findOne({where: {id}, relations: ['properties']});
        if (!location)
            throw new BusinessLogicException("The location with the given id was not found", BusinessError.NOT_FOUND);

        return location;
    }

    async create(location: LocationEntity): Promise<LocationEntity> {
        return await this.locationRepository.save(location);
    }

    async update(id: string, location: LocationEntity): Promise<LocationEntity> {
        const persistedLocation = await this.locationRepository.findOne({where: {id}});
        if (!persistedLocation) 
            throw new BusinessLogicException("The location with the given id was not found", BusinessError.NOT_FOUND);

        return await this.locationRepository.save({...persistedLocation, ...location});
    }

    async delete(id: string) {
        const location: LocationEntity = await this.locationRepository.findOne({where: {id}});
        if (!location)
            throw new BusinessLogicException("The location with the given id was not found", BusinessError.NOT_FOUND);
        
        return this.locationRepository.remove(location);
    }
}
