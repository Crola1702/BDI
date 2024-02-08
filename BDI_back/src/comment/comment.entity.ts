import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from '../post/post.entity';

@Entity()
export class CommentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    comment: string;

    @Column()
    type: string;

    @OneToOne(() => CommentEntity)
    @JoinColumn()
    response: CommentEntity;

    @ManyToOne(() => PostEntity, post=> post.comments)
    post: PostEntity

}


