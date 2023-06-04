import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    BaseEntity
  } from "typeorm";
  import { Service } from "typedi";
  import User from "./User";
import Comment from "./Comment";
  
  @Service()
  @Entity({ name: "comment_like" })
  export default class CommentLike extends BaseEntity{
    
    @PrimaryGeneratedColumn("increment")
    id: number;
  
    @Column({ name: "comment_id" })
    commentId:string;
  
    @ManyToOne(() => Comment, (comment) => comment.id, {
      cascade: true,
      onDelete: "CASCADE"
    })
    @JoinColumn({ name: "comment_id" })
    comment: Comment;

    @ManyToOne(() => User, (user) => user.id, {
      cascade: false
    })
    @Column({name:"user_id"})
    userId: string;
  }
  