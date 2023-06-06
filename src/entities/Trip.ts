import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import User from "./User";
import { Service } from "typedi";
import Post from "./Post";
import { defaultColumn } from "./common/default-column";

@Entity({ name: "trip" })
@Service()
export default class Trip extends defaultColumn {

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({name:'userId'})
  user_id: User

  @ManyToOne(() => Post, (post) => post.id)
  @JoinColumn({name:'postId'})
  post_id: Post;
}
