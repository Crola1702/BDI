import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { LocationEntity } from '../location/location.entity';
import { PostEntity } from '../post/post.entity';

@Entity()
export class PropertyEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: "decimal", precision: 10, scale: 2})
    area: number;

    @OneToOne(() => PostEntity, post => post.property)
    post: PostEntity;

    @ManyToOne(() => LocationEntity, location => location.properties, {
        cascade: ['insert']
    })
    location: LocationEntity;

    @Column()
    address: string;

}
