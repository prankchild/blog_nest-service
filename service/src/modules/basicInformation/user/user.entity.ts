import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  Timestamp,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { $enum } from "ts-enum-util";
import { RoleEntity } from "../role/role.entity";
import { StatusValue } from "@/common/enums/common.enum";

@Entity("nest_blog_user")
export class UserEntity {
  @ApiProperty({ type: String, description: "id" })
  @PrimaryGeneratedColumn({ type: "bigint" })
  public id: string;

  @Exclude({ toPlainOnly: true }) // 输出屏蔽密码
  @Column({
    type: "varchar",
    length: 200,
    nullable: false,
    comment: "用户登录密码",
  })
  public password: string;

  @Exclude({ toPlainOnly: true }) // 输出屏蔽盐
  @Column({
    type: "varchar",
    length: 200,
    nullable: false,
    comment: "用户登录密码",
  })
  public salt: string;

  @ApiProperty({ type: String, description: "用户登录账号" })
  @Column({ type: "varchar", length: 32, comment: "用户登录账号" })
  public account: string;

  @ApiProperty({ type: String, description: "手机号" })
  @Column({
    type: "varchar",
    name: "phone",
    default: "",
    length: 20,
    comment: "用户手机号码",
  })
  public phone: string;

  @ApiProperty({ type: String, description: "邮箱" })
  @Column({ type: "varchar", comment: "邮箱地址", default: "" })
  public email: string;

  @ApiProperty({
    type: String,
    description: "所属状态: 1-有效，0-禁用",
    enum: $enum(StatusValue).getValues(),
  })
  @Column({
    type: "tinyint",
    default: StatusValue.NORMAL,
    comment: "所属状态: 1-有效，0-禁用",
  })
  public status: StatusValue;

  @ApiProperty({ type: String, description: "头像url" })
  @Column({ type: "varchar", comment: "头像地址" })
  public avatar: string;

  @ApiProperty({ type: String, description: "描述" })
  @Column({ type: "varchar", comment: "描述" })
  public describe: string;

  @ApiProperty({ type: Date, description: "创建时间" })
  @CreateDateColumn({
    // type: "timestamp",
    name: "create_date",
    // comment: "创建时间",
    // length: 0,
  })
  createDate: Timestamp;

  @ApiProperty({ type: Date, description: "更新时间" })
  @UpdateDateColumn({
    name: "update_date",
  })
  updateDate: Timestamp;
  role?: RoleEntity[];
}
