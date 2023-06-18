import { Entity, Column, OneToOne, JoinColumn} from "typeorm";
import { Service } from "typedi";
import User from "./User";
import { GenderType } from "../common";
import { defaultColumn } from "./common/default-column";

@Service()
@Entity({ name: "profile" })
export default class Profile extends defaultColumn {
    
    @Column({ name: "user_id" })
    userId: string;

    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn({name:"user_id"})
    user: User;

    @Column({nullable:true,default:"",length:500})
    profileImage:string;

    @Column({nullable:true,type:String,default:""})
    tagLine:string;
  @Column()
  name: string;

  @Column({ nullable: true, type: String })
  nickname: string | null;

  @Column({ nullable: true, type: String })
  gender: GenderType | null;

}
