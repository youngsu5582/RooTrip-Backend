import {
  Entity,
  Column,
  OneToMany,
  BeforeInsert,
  ManyToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import Post from "./Post";
import Profile from "./Profile";


import { hashSync, compareSync } from "bcrypt";
import { defaultColumn } from "./common/default-column";

@Entity({ name: "user" })
export default class User extends defaultColumn {
  
  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ nullable: true, type: String })
  password: string | null;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @Column({ nullable: true, type: String })
  refreshToken: string | null;

  @ManyToMany(() => User)
  following: User[];

  @ManyToMany(() => User)
  followers: User[];

  @OneToOne(() => Profile, profile => profile.user, {
    cascade: true
  })
  @JoinColumn({name:"profile_id"})
  profile: Profile;

  @Column({name:"profile_id",nullable:true})
  profileId:string;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = hashSync(this.password, 10);
    }
  }

  async comparePassword(unencryptedPassword: string) {
    return compareSync(unencryptedPassword, this.password!);
  }
}
