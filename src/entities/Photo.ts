import {
    Entity,
    Column,
    Index,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
}
from 'typeorm';
import { Service } from 'typedi';
import Post from './Post';

@Service()
@Entity({name:"photo"})
export default class Photo{
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({})
    provider : string;


    @Column({})
    image_url : string;
    
    @ManyToOne(()=>Post,(post)=>post.id,{
        cascade:true,
        onDelete:'CASCADE',
    })
    @JoinColumn({ name: "post_id" })
    post:Post;
    
    @Index({spatial:true})
    @Column({
        type : 'geometry',
        spatialFeatureType: 'Point',
        srid:4326,
        select:false
    })
    coordinate : string;

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

};