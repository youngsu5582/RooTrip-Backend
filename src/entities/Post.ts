import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import User from "./User";
import { Service } from "typedi";
import Photo from "./Photo";
import { defaultColumn } from "./common/default-column";
import Comment from "./Comment";

@Entity({ name: "post" })
@Service()
export default class Post extends defaultColumn {
  @Column({ name: "user_id" , select:false })
  userId: string;

  @ManyToOne(() => User, (user) => user.posts, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ nullable: false })
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "int", default: 0 })
  like: number;


  @Column({name:"view_count",type:"int" , default:0})
  viewCount : number;

  @Column({type:"simple-array"})
  routes:number[];

  
  @OneToMany(() => Photo, (photo) => photo.post)
  @JoinColumn()
  photos: Photo[];

  @OneToMany(() => Comment, (comment) => comment.post)
  @JoinColumn()
  comments: Comment[];
  
  // 차후 수정
  @Column({type:"int",default:0,select:false})
  point : number;



}
