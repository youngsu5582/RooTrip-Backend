import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany
} from "typeorm";
import User from "./User";
import { Service } from "typedi";
import Photo from "./Photo";
import { defaultColumn } from "./common/default-column";
type FlagType = "public" | "private" | "protected";

@Entity({ name: "post" })
@Service()
export default class Post extends defaultColumn {
  @Column({ name: "user_id" })
  userId: string;

  @ManyToOne(() => User, (user) => user.posts, {
    cascade: true,
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ nullable: false })
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "int", default: 0 })
  like: number;

  // 차후 수정
  @OneToMany((type) => Photo, (photo) => photo.post)
  photos: Photo[];
}
