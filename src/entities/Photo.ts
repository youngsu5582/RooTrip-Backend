import { Entity, Column, Index, ManyToOne, JoinColumn } from "typeorm";
import { Service } from "typedi";
import Post from "./Post";
import { defaultColumn } from "./common/default-column";

@Service()
@Entity({ name: "photo" })
export default class Photo extends defaultColumn {
  @Column({length:500,name:"image_url"})
  imageUrl: string;

  @Column({ name: "post_id" })
  postId: string;

  @ManyToOne(() => Post, (post) => post.photos, {
    cascade: true,
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "post_id" })
  post: Post;

  @Index({ spatial: true })
  @Column({ 
    type: "geometry",
    spatialFeatureType: "Point",
    srid: 4326
  })
  coordinate: string;

  @Column()
  city: string;

  @Column()
  first: string;

  @Column({ nullable: true })
  second: string;

  @Column({type:"smallint",name:"photo_order"})
  order : number;

  // @Column({nullable:true})
  // third!: string;

  // @Column({nullable:true})
  // fourth!: string;
}
