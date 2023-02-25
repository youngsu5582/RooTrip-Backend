import {
    Entity,
    
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
}
from 'typeorm';
import Post from './Post';

@Entity({name:"user"})
export default class User{
    @PrimaryGeneratedColumn("uuid")
    id:string;

    
    @Column({ length: 100 })
    email: string;

    @Column({select:false})
    password:string;

    @OneToMany((type)=>Post,(post)=>post.user)
    posts:Post[];

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
  
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
    
}