import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity
} from "typeorm";
import { Service } from "typedi";
import Post from "./Post";
import User from "./User";

@Service()
@Entity({ name: "like" })
export default class Like extends BaseEntity{
  
  @PrimaryGeneratedColumn("increment")
  id: number;


  @Column({ name: "post_id" })
  postId:string;

  @ManyToOne(() => Post, (post) => post.like, {
    cascade: true,
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "post_id" })
  post: Post;



  @ManyToOne(() => User, (user) => user.id, {
    cascade: false
  })
  @JoinColumn({name:"user_id"})

  @Column({name:"user_id"})
  userId: string;
}
