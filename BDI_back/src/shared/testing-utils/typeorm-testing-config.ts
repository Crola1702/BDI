import { TypeOrmModule } from '@nestjs/typeorm'
import { CommentEntity } from '../../comment/comment.entity'
import { LocationEntity } from '../../location/location.entity'
import { PostEntity } from '../../post/post.entity'
import { PropertyEntity } from '../../property/property.entity'
import { UserEntity } from '../../user/user.entity'

export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [CommentEntity, LocationEntity, PostEntity, PropertyEntity, UserEntity],
        synchronize: true,
        keepConnectionAlive: true
    }),
    TypeOrmModule.forFeature([CommentEntity, LocationEntity, PostEntity, PropertyEntity, UserEntity])
]
