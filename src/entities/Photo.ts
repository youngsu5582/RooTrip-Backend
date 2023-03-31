import {
    Entity,
    Column,
    Index,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    Point,
}
from 'typeorm';
import { Service } from 'typedi';
import Post from './Post';

@Service()
@Entity({name:"photo"})
export default class Photo{
    constructor(){}
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({})
    image_url : string;
    
    @ManyToOne(()=>Post,(post)=>post.id,{
        cascade:true,
        onDelete:'CASCADE',
    })
    @Column({ name: "post_id" })
    postId: string;
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