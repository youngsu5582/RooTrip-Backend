import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert
} from "typeorm";
import { Service } from "typedi";
import Post from "./Post";
import User from "./User";

@Service()
@Entity({ name: "like" })
export default class Like {
  constructor() {}
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "post_id" })
  postId: string;

  @ManyToOne(() => Post, (post) => post.id, {
    cascade: true,
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "post_id" })
  post: Post;

  @ManyToOne(() => User, (user) => user.id, {
    cascade: false
  })
  userId: string;
  @BeforeInsert()
  async incrementLike() {
    this.post.like++;
  }
}
