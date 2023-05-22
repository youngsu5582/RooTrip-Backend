import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import User from "./User";
import { Service } from "typedi";
import Photo from "./Photo";
import { defaultColumn } from "./common/default-column";

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


  @Column({type:"simple-array"})
  routes:number[];

  // 차후 수정
  @OneToMany(() => Photo, (photo) => photo.post)
  photos: Photo[];
  
  @Column({type:"int",default:0})
  point : number;

  @Column({})
  thumbnailImage : string;


}
