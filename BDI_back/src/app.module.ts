import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentModule } from './comment/comment.module';
import { CommentEntity } from './comment/comment.entity';
import { PostModule } from './post/post.module';
import { PostEntity } from './post/post.entity';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/user.entity';
import { LocationModule } from './location/location.module';
import { PropertyModule } from './property/property.module';
import { PropertyEntity } from './property/property.entity';
import { LocationEntity } from './location/location.entity';
import { PostCommentModule } from './post-comment/post-comment.module';
import { UserPostModule } from './user-post/user-post.module';
import { PropertyLocationModule } from './property-location/property-location.module';
import { QuestionResponseModule } from './question-response/question-response.module';

import { AuthModule } from './auth/auth.module';
import { APP_GUARD   } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './shared/security/roles.guard';

@Module({
  imports: [UserModule, LocationModule, PostModule, CommentModule, PropertyModule, UserPostModule, PropertyLocationModule, PostCommentModule, QuestionResponseModule, // Add Modules here!
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'bdi', // You should create BDI database
      entities: [UserEntity, LocationEntity, PostEntity, CommentEntity, PropertyEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }), AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
})
export class AppModule {}
