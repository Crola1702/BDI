import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { CommentEntity } from "../comment/comment.entity";
import { PropertyEntity } from "../property/property.entity";

@Entity()

export class PostEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    price: number;

    @Column()
    contactPhone: string;

    @Column()
    title: string;

    @Column({nullable: true})
    images: string;

    @Column({nullable: true})
    tags: string;

    @Column()
    description: string;

    @Column()
    contractType: string; // sale, rent, vacational

    @ManyToOne(() => UserEntity, user => user.posts)
    publisher: UserEntity;

    @OneToMany(() => CommentEntity, comment => comment.post)
    comments: CommentEntity[];

    @OneToOne(() => PropertyEntity, property => property.post, {
        cascade: true, // When a post is deleted, the property is deleted too
    })
    @JoinColumn()
    property: PropertyEntity;
}
