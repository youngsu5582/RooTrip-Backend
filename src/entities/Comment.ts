import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Service } from "typedi";
import Post from "./Post";
import User from "./User";
import { defaultColumn } from "./common/default-column";

@Service()
@Entity({ name: "comment" })
export default class Comment extends defaultColumn {
  @ManyToOne(() => Post, (post) => post.id, {
    cascade: true,
    onDelete: "CASCADE"
  })
  @Column({ name: "post_id" })
  postId: string;

  @JoinColumn({ name: "post_id" })
  post: Post;

  @Column({ length: 300 })
  comment: string;

  @ManyToOne(() => User, (user) => user.id, {
    cascade: true,
    onDelete: "CASCADE"
  })
  @Column({ name: "user_id" })
  userId: string;

  @JoinColumn({ name: "user_id" })
  user: User;
}
