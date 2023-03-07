import {
    Entity,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    BeforeInsert,
}
from 'typeorm';
import Post from './Post';
import { CreateUserDto } from '../dtos/UserDto';
import { GenderType } from '../common';
import {hashSync,compareSync} from 'bcrypt';

@Entity({name:"user"})
export default class User{
    


    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({ length: 100 })
    email: string;

    @Column()
    name:string;

    @Column()
    nickname:string;


    @Column()
    phoneNumber:string;

    @Column()
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