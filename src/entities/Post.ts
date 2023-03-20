import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    DeleteDateColumn,
    OneToMany,
}
from 'typeorm';
import User from './User';
import { Service } from 'typedi';
import Photo from './Photo';
type FlagType = 'public'|'private'|'protected';

@Entity({name:"post"})
@Service()


export default class Post{
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({ name: "user_id" })
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

    @Column({type:'int'})
    like : number;


    // 차후 수정
    @OneToMany((type)=>Photo,(photo)=>photo.post)
    photos:Photo[];

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
  
    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt: Date;
    
    @Column()
    flag: boolean;
}