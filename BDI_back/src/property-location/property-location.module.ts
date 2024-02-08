import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyEntity } from 'src/property/property.entity';
import { LocationEntity } from 'src/location/location.entity';
import { PropertyLocationService } from './property-location.service';
import { PropertyLocationController } from './property-location.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyEntity, LocationEntity])],
  providers: [PropertyLocationService],
  controllers: [PropertyLocationController]
})
export class PropertyLocationModule {}
