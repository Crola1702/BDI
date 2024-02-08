import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserRole } from '../shared/enums/role.enum';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ){}

    async findAll(): Promise<UserEntity[]> {
        return await this.userRepository.find( { relations: ["posts"] });
    }

    async findOne(id: string): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOne({where: {id} , relations: ["posts"] });
        if (!user) 
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
        return user;
    }

    async findByUsername(username: string): Promise<UserEntity | undefined> {
        const user: UserEntity = await this.userRepository.findOne({where: {username} , relations: ["posts"] });
        if (!user) 
            throw new BusinessLogicException("The user with the given username was not found", BusinessError.NOT_FOUND);
        return user;
    }

    async create(user: UserEntity): Promise<UserEntity> {
        const persistedUser: UserEntity = await this.userRepository.findOne({where: {username: user.username} });
        if (persistedUser)
            throw new BusinessLogicException("The user with the given username already exists", BusinessError.PRECONDITION_FAILED);
        if (!Object.values(UserRole).includes(user.role as UserRole))
            throw new BusinessLogicException("The user role is invalid", BusinessError.BAD_REQUEST);
        return await this.userRepository.save(user);
    }

    async update(id: string, user: UserEntity): Promise<UserEntity> {
        const persistedUser: UserEntity = await this.userRepository.findOne({where: {id} });
        if (!persistedUser)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
        return await this.userRepository.save({...persistedUser, ...user});
    }

    async delete(id: string): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOne({where: {id} });
        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
        
        return await this.userRepository.remove(user);
    }
}
