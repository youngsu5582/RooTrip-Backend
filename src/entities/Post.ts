import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
}
from 'typeorm';
import User from './User';
import { Service } from 'typedi';
import { CreatePostDto } from '../dtos/PostDto';

@Entity({name:"post"})
@Service()


export default class Post{
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({ name: "user_id", length: 36 })
    userId: string;

    @ManyToOne(()=>User,(user)=>user.id,{
        cascade:true,
        onDelete:'CASCADE',
    })
    @JoinColumn({ name: "user_id" })
    user:User;

    @Column({nullable:false})
    title : string;

    @Column({type:'text'})
    content : string;
    
}