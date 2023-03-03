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
import { CreateUserDto } from '../dtos/UserDto';
import { GenderType } from '../common';

@Entity({name:"user"})
export default class User{
    


    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({ length: 100 })
    email: string;

    @Column()
    nickname:string;

    @Column()
    birth:Date;

    @Column()
    phoneNumber:string;

    @Column({select:false})
    password:string;

    @Column()
    gender : GenderType

    @OneToMany((type)=>Post,(post)=>post.user)
    posts:Post[];

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
  
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
    
}