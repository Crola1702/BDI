import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm'
import { PostEntity } from './post.entity';
import { ContractType } from '../shared/enums/contract-type.enum';

import { writeFile, mkdir, existsSync } from 'fs';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>
    ){}

    ensureDirectoryExistence(filePath: string) {
        const dirname = filePath.substring(0, filePath.lastIndexOf('/'));
        if (existsSync(dirname)) {
            return true;
        }
        this.ensureDirectoryExistence(dirname);
        mkdir(dirname, { recursive: true }, (err) => {
            if (err) throw err;
        });
    }

    async findAll(): Promise<PostEntity[]> {
        return await this.postRepository.find({ relations: ['publisher', 'property']});
    }

    async findOne(id: string): Promise<PostEntity> {
        const post = await this.postRepository.findOne({where: {id}, relations: ['publisher', 'property']});
        if (!post) {
            throw new BusinessLogicException('Post not found', BusinessError.NOT_FOUND);
        }
        return post;
    }

    async create(post: PostEntity): Promise<PostEntity> {
        if (!Object.values(ContractType).includes(post.contractType as ContractType)) {
            throw new BusinessLogicException('Invalid contract type', BusinessError.BAD_REQUEST);
        }
        return await this.postRepository.save(post);
    }

    async update(id: string, post: PostEntity): Promise<PostEntity> {
        const postToUpdate = await this.postRepository.findOne({where: {id}});
        if (!postToUpdate) {
            throw new BusinessLogicException('Post not found', BusinessError.NOT_FOUND);
        }
        return await this.postRepository.save({...postToUpdate, ...post});
    }

    async delete(id: string): Promise<PostEntity> {
        const postToDelete = await this.postRepository.findOne({where: {id}});
        if (!postToDelete) {
            throw new BusinessLogicException('Post not found', BusinessError.NOT_FOUND);
        }
        return await this.postRepository.remove(postToDelete);
    }

    async saveImage(id: string, image: Express.Multer.File) {
        const filePath = 'uploads/' + `${id}/` + image.originalname;
        
        const postToUpdate = await this.postRepository.findOne({where: {id}});
        if (!postToUpdate) {
            throw new BusinessLogicException('Post not found', BusinessError.NOT_FOUND);
        }

        while (!this.ensureDirectoryExistence(filePath)) {
            this.ensureDirectoryExistence(filePath);
        }
        
        writeFile(filePath, image.buffer, (err) => {
            if (err) {
                throw new BusinessLogicException(`Error saving image: ${err}`, BusinessError.FILE_UPLOAD_ERROR);
            }
        });

        if (!postToUpdate.images) {
            postToUpdate.images = filePath;
        } else {
            postToUpdate.images += ',' + filePath;
        }

        return await this.postRepository.save({...postToUpdate});
    }
}
