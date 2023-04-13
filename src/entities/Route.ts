import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
  UpdateDateColumn
} from "typeorm";
import User from "./User";
import { Service } from "typedi";
import Photo from "./Photo";
import Comment from "./Comment";
enum FlagType {
  PUBLIC = "public",
  PRIVATE = "private",
  ONLYME = ""
}

@Entity({ name: "route" })
@Service()
export default class Route {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id" })
  userId: string;

  @ManyToOne(() => User, (user) => user.id, {
    cascade: true,
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ nullable: false })
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "int" })
  like: number;

  @OneToMany(() => Photo, (photo) => photo.post)
  photos: Photo[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;

  @Column({ type: "enum", enum: FlagType })
  flag: FlagType;
}
