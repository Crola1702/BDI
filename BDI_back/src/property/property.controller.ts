import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PropertyDto } from './property.dto';
import { PropertyEntity } from './property.entity';
import { PropertyService } from './property.service';
import { UserRole } from '../shared/enums/role.enum';
import { Public } from '../shared/security/public.decorator';
import { Roles } from '../shared/security/roles.decorator';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('properties')
export class PropertyController {
    constructor(
        private readonly propertyService: PropertyService,
    ) {}

    @Roles(UserRole.ADMIN, UserRole.PROPERTY_ADMIN, UserRole.PROPERTY_READ)
    @Get()
    async findAll() {
        return await this.propertyService.findAll();
    }

    @Roles(UserRole.ADMIN, UserRole.PROPERTY_ADMIN, UserRole.PROPERTY_READ)
    @Get(':propertyId')
    async findOne(@Param('propertyId') propertyId: string) {
        return await this.propertyService.findOne(propertyId);
    }

    @Roles(UserRole.ADMIN, UserRole.PROPERTY_ADMIN, UserRole.PROPERTY_WRITE)
    @Post()
    async create(@Body() propertyDto: PropertyDto) {
        const property: PropertyEntity = plainToInstance(PropertyEntity, propertyDto)
        return await this.propertyService.create(property);
    }

    @Roles(UserRole.ADMIN, UserRole.PROPERTY_ADMIN, UserRole.PROPERTY_WRITE)
    @Put(':propertyId')
    async update(@Param('propertyId') propertyId: string, @Body() propertyDto: PropertyDto) {
        const property: PropertyEntity = plainToInstance(PropertyEntity, propertyDto)
        return await this.propertyService.update(propertyId, property);
    }

    @Roles(UserRole.ADMIN, UserRole.PROPERTY_ADMIN, UserRole.PROPERTY_DELETE)
    @Delete(':propertyId')
    @HttpCode(204)
    async delete(@Param('propertyId') propertyId: string) {
        return await this.propertyService.delete(propertyId)
    }

}
