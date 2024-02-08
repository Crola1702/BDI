import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from 'src/post/post.entity';
import { PropertyEntity } from 'src/property/property.entity';
import { PostPropertyService } from './post-property.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, PropertyEntity])],
  providers: [PostPropertyService]
})
export class PostPropertyModule {}
