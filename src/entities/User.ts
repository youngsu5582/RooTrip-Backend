import {
  Entity,
  Column,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  ManyToMany,
  OneToOne,
  JoinColumn
} from "typeorm";
import Post from "./Post";
import Profile from "./Profile";

import { GenderType } from "../common";
import { hashSync, compareSync } from "bcrypt";
import { defaultColumn } from "./common/default-column";

@Entity({ name: "user" })
export default class User extends defaultColumn {
  
  @Column({ length: 100, nullable: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true, type: String })
  nickname: string | null;

  @Column({ nullable: true, type: String })
  password: string | null;

  @Column({ nullable: true, type: String })
  gender: GenderType | null;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @Column({ nullable: true, type: String })
  refreshToken: string | null;

  @ManyToMany(() => User)
  following: User[];

  @ManyToMany(() => User)
  followers: User[];

  @OneToOne(() => Profile, profile => profile.user, { cascade: true })
  @JoinColumn()
  profile: Profile;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = hashSync(this.password, 10);
    }
  }

  async comparePassword(unencryptedPassword: string) {
    return compareSync(unencryptedPassword, this.password!);
  }
}
