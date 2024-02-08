import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationController } from './location.controller';
import { LocationEntity } from './location.entity';
import { LocationService } from './location.service';

@Module({
  providers: [LocationService],
  controllers: [LocationController],
  imports: [TypeOrmModule.forFeature([LocationEntity])],
})
export class LocationModule {}
