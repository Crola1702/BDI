import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyEntity } from './property.entity';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';

@Module({
  providers: [PropertyService],
  imports: [TypeOrmModule.forFeature([PropertyEntity])],
  controllers: [PropertyController],
})
export class PropertyModule {}
