import {
    Entity,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    BeforeInsert,
    PrimaryColumn,
}
from 'typeorm';
import Post from './Post';

import { GenderType } from '../common';
import {hashSync,compareSync} from 'bcrypt';
import {v4} from 'uuid';

@Entity({name:"user"})
export default class User{
    
    constructor(){
        
    }


    @PrimaryGeneratedColumn()
    id:string;

    @Column({ length: 100 })
    email: string;

    @Column()
    name:string;

    @Column()
    nickname:string;

    @Column({nullable:true})
    password:string;

    @Column()
    gender : GenderType

    @OneToMany((type)=>Post,(post)=>post.user)
    posts:Post[];

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
  
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @Column()
    
    refreshToken : string;
    
    @BeforeInsert()
    async hashPassword(){
        this.password = hashSync(this.password,10);
    }

    async comparePassword(unencryptedPassword: string){
        
        return compareSync(unencryptedPassword,this.password);
    }

}