import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./User";

@Entity()
export default class Follower {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.followers)
  follower: User;

  @ManyToOne((type) => User, (user) => user.following)
  following: User;
}
