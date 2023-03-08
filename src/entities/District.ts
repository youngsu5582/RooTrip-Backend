import {
    Entity,
    Column,
    Geometry,
    Index,
    PrimaryGeneratedColumn,
}
from 'typeorm';
import { Service } from 'typedi';


@Entity({name:"district",synchronize:false})

@Service()
export default class District{
    @PrimaryGeneratedColumn("increment")
    id:number;

    @Column()
    city: string;

    @Column()
    first: string;
    
    @Column({nullable:true})
    second: string;
    
    @Column({nullable:true})
    third: string;
    
    @Column({nullable:true})
    fourth: string;

    @Index({spatial:true})
    @Column({
        type : 'geometry',
        spatialFeatureType: 'Point',
        srid:4326,
        select:false
    })
    coordinate : string;
}