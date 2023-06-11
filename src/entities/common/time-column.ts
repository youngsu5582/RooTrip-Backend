import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn
} from "typeorm";

export abstract class CreatedAtColumn extends BaseEntity {
  @CreateDateColumn({ name: "created_at",select:false  })
  public readonly createdAt!: Date;
  @UpdateDateColumn({ name: "updated_at" ,select:false})
  public readonly updatedAt!: Date | string;
  @DeleteDateColumn({ name: "deleted_at",select:false })
  public readonly deletedAt: Date | string;
}
