import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { LocationDto } from './location.dto';
import { LocationEntity } from './location.entity';
import { LocationService } from './location.service';

@Controller('locations')
@UseInterceptors(BusinessErrorsInterceptor)
export class LocationController {
    constructor(private readonly locationService: LocationService) {}

    @Get()
    async findAll() {
        return await this.locationService.findAll();
    }

    @Get(':locationId')
    async findOne(@Param('locationId') locationId: string) {
        return await this.locationService.findOne(locationId);
    }

    @Post()
    async create(@Body() locationDto: LocationDto) {
        const location: LocationEntity = plainToInstance(LocationEntity, locationDto);
        return await this.locationService.create(location);
    }

    @Put(':locationId')
    async update(@Param('locationId') locationId: string, @Body() locationDto: LocationDto) {
        const location: LocationEntity = plainToInstance(LocationEntity, locationDto);
        return await this.locationService.update(locationId, location);
    }

    @Delete(':locationId')
    @HttpCode(204)
    async delete(@Param('locationId') locationId: string) {
        return await this.locationService.delete(locationId);
    }
}
