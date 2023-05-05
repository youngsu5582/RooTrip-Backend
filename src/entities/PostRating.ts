import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, BaseEntity } from 'typeorm';
import User from './User';
import Post from './Post';

@Entity({name : 'post_rating'})
export default class PostRating extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:"post_id"})
  postId: number;

  @Column({name:"user_id"})
  userId: number;
  
  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  rating:number;

  @CreateDateColumn({ name: "created_at" })
  public readonly createdAt!: Date;
} 