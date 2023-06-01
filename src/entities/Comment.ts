import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Service } from "typedi";
import Post from "./Post";
import User from "./User";
import { defaultColumn } from "./common/default-column";

@Service()
@Entity({ name: "comment" })
export default class Comment extends defaultColumn {
  
  @Column({ name: "post_id" ,select:false})
  postId: string;

  @ManyToOne(() => Post, (post) => post.comments, {
    cascade: true,
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "post_id" })
  post: Post;

  @Column({ type: 'text',  charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  comment: string;

  @ManyToOne(() => User, (user) => user.id, {
    cascade: true,
    onDelete: "CASCADE"
  })
  @Column({ name: "user_id",select:false})
  userId: string;

  @JoinColumn({ name: "user_id" })
  user: User;
}
