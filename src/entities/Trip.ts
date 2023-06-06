import { Entity, Column } from "typeorm";
import { Service } from "typedi";
import { defaultColumn } from "./common/default-column";

@Entity({ name: "trip" })
@Service()
export default class Trip extends defaultColumn {

  @Column()
  userId: string;

  @Column()
  postId: string;
}
