import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { PropertyEntity } from './property.entity';

@Injectable()
export class PropertyService {
    constructor(
        @InjectRepository(PropertyEntity)
        private readonly propertyRepository: Repository<PropertyEntity>
    ){}

    async findAll(): Promise<PropertyEntity[]> {
        return await this.propertyRepository.find({ relations: ['post', 'location']});
    }

    async findOne(id: string): Promise<PropertyEntity> {
        const property = await this.propertyRepository.findOne({where: {id}, relations: ['post', 'location']});
        if (!property) {
            throw new BusinessLogicException('Property not found', BusinessError.NOT_FOUND);
        }
        return property;
    }

    async create(property: PropertyEntity): Promise<PropertyEntity> {
        return await this.propertyRepository.save(property);
    }

    async update(id: string, property: PropertyEntity): Promise<PropertyEntity> {
        const propertyToUpdate = await this.propertyRepository.findOne({where: {id}});
        if (!propertyToUpdate) {
            throw new BusinessLogicException('Property not found', BusinessError.NOT_FOUND);
        }
        return await this.propertyRepository.save({...propertyToUpdate, ...property});
    }

    async delete(id: string): Promise<PropertyEntity> {
        const propertyToDelete = await this.propertyRepository.findOne({where: {id}});
        if (!propertyToDelete) {
            throw new BusinessLogicException('Property not found', BusinessError.NOT_FOUND);
        }
        return await this.propertyRepository.remove(propertyToDelete);
    }
    
}
