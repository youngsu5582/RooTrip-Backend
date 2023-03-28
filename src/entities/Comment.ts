import {
    Entity,
    Column,
    Index,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
}
from 'typeorm';
import { Service } from 'typedi';
import Post from './Post';
import User from './User';

@Service()
@Entity({name:"comment"})
export default class Comment{
    
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ManyToOne(()=>Post,(post)=>post.id,{
        cascade:true,
        onDelete:'CASCADE',
    })
    @Column({ name: "post_id" })
    postId: string;
    
    @JoinColumn({ name: "post_id" })
    post:Post;
  
    @Column({length:300})
    comment : string;
    
    @ManyToOne(()=>User,(user)=>user.id,{
        cascade:true,
        onDelete:'CASCADE',
    })
    @Column({ name: "user_id" })
    userId: string;

    @JoinColumn({ name: "user_id" })
    user:User;
    
    @CreateDateColumn({name:"create_at"})
    createdAt: Date;
    
}