import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PropertyLocationService } from './property-location.service';
import { PropertyEntity } from '../property/property.entity';
import { LocationEntity } from 'src/location/location.entity';
import { HttpCode } from '@nestjs/common/decorators';

@Controller('locations')
@UseInterceptors(BusinessErrorsInterceptor)
export class PropertyLocationController {
    constructor(private readonly propertyLocationService: PropertyLocationService) {}

    @Post(':locationId/properties/:propertyId')
    async addPropertyLocation(@Param('locationId') locationId: string, @Param('propertyId') propertyId: string): Promise<PropertyEntity> {
        return await this.propertyLocationService.addPropertyLocation(propertyId, locationId);
    }

    // TODO: Como hacer el findLocationByPropertyId? Crear otro modulo y servicio o como hacer el enrutador del controller?
    
    @Get(':locationId/properties')
    async findPropertiesByLocationId(@Param('locationId') locationId: string): Promise<PropertyEntity[]> {
        return await this.propertyLocationService.findPropertiesByLocationId(locationId);
    }

    @Get(':locationId/properties/:propertyId')
    async findPropertyByLocationIdPropertyId(@Param('locationId') locationId: string, @Param('propertyId') propertyId: string): Promise<PropertyEntity> {
        return await this.propertyLocationService.findPropertyByLocationIdPropertyId(locationId, propertyId);
    }

    @Put(':locationId/properties')
    async associatePropertiesLocation(@Param('locationId') locationId: string, @Body() properties: PropertyEntity[]): Promise<LocationEntity> {
        return await this.propertyLocationService.associatePropertiesLocation(locationId, properties);
    }

    @Delete(':locationId/properties/:propertyId')
    @HttpCode(204)
    async removePropertyLocation(@Param('locationId') locationId: string, @Param('propertyId') propertyId: string): Promise<LocationEntity> {
        return await this.propertyLocationService.deletePropertyLocation(locationId, propertyId);
    }

}
