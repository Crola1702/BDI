import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from '../post/post.entity';
import { PropertyEntity } from '../property/property.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class PostPropertyService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,

        @InjectRepository(PropertyEntity)
        private readonly propertyRepository: Repository<PropertyEntity>,
    ){}

    async addPropertyPost(postId: string, propertyId: string): Promise<PostEntity> {
        const post = await this.postRepository.findOne({ where: {id: postId}, relations: ['publisher', 'property']});
        if (!post) {
            throw new BusinessLogicException('Post not found', BusinessError.NOT_FOUND);
        }

        const property = await this.propertyRepository.findOne({ where: {id: propertyId} });
        if (!property) {
            throw new BusinessLogicException('Property not found', BusinessError.NOT_FOUND);
        }

        post.property = property;
        return await this.postRepository.save(post);
    }

    async findPropertyByPost(postId: string): Promise<PropertyEntity> {
        const post = await this.postRepository.findOne({ where: {id: postId}, relations: ['publisher', 'property']});
        if (!post) {
            throw new BusinessLogicException('Post not found', BusinessError.NOT_FOUND);
        }

        return post.property;
    }

    async updatePropertyPost(postId: string, newPropertyId: string): Promise<PostEntity> {
        const post = await this.postRepository.findOne({ where: {id: postId}, relations: ['publisher', 'property']});
        if (!post) {
            throw new BusinessLogicException('Post not found', BusinessError.NOT_FOUND);
        }

        const property = await this.propertyRepository.findOne({ where: {id: newPropertyId} });
        if (!property) {
            throw new BusinessLogicException('Property not found', BusinessError.NOT_FOUND);
        }

        post.property = property;
        return await this.postRepository.save(post);
    }

}
