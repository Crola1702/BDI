import { Column, Entity, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { PostEntity } from "../post/post.entity";

@Entity()
export class UserEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column({ unique: true }) // May cause some flaky tests used in conjunction with faker
 username: string;

 @Column()
 password: string;

 @Column()
 role: string; // user, seller, admin
 
 @Column()
 verifiedUser: boolean;
 
 @Column()
 approvedForSale: boolean;

 @OneToMany(() => PostEntity, post => post.publisher)
 posts: PostEntity[];
}