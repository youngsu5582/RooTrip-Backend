import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn
} from "typeorm";

export abstract class CreatedAtColumn extends BaseEntity {
  @CreateDateColumn({ name: "created_at" })
  public readonly createdAt!: Date;
  @UpdateDateColumn({ name: "updated_at" })
  public readonly updatedAt!: Date | string;
  @DeleteDateColumn({ name: "deleted_at" })
  public readonly deletedAt: Date | string;
}
