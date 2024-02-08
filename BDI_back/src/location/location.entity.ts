import { PropertyEntity } from '../property/property.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';

@Entity()
export class LocationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({type: "decimal", precision: 15, scale: 2, nullable: true})
    latitude: number;

    @Column({type: "decimal", precision: 15, scale: 2, nullable: true})
    longitude: number;

    @Column()
    address: string;

    @OneToMany(() => PropertyEntity, property => property.location)
    properties: PropertyEntity[];
}
