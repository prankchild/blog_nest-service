import { ApiProperty } from "@nestjs/swagger/dist";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { AvailableRange, StatusValue } from "@/common/enums/common.enum";

@Entity("nest_blog_role")
export class RoleEntity {
  @ApiProperty({ description: "id" })
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: string;

  @ApiProperty({ description: "角色名称" })
  @Column({ type: "varchar", length: 100, comment: "角色名称" })
  name: string;

  @ApiProperty({ description: "角色备注" })
  @Column({ type: "varchar", length: 100, default: "", comment: "角色备注" })
  remark: string;

  @Column({
    type: "tinyint",
    default: StatusValue.NORMAL,
    comment: "所属状态: 1-有效，0-禁用",
  })
  public status: StatusValue;

  @ApiProperty({ description: "可用范围" })
  @Column({
    type: "tinyint",
    name: "available_range",
    default: AvailableRange.BlogPage,
    comment: "可用范围: 1-后台管理系统，0-博客页面，2全部",
  })
  availableRange: string;

  @CreateDateColumn({
    type: "datetime",
    name: "create_date",
    comment: "创建时间",
    length: 0,
  })
  @ApiProperty({ description: "创建时间" })
  createDate: Date;

  @UpdateDateColumn({
    type: "datetime",
    name: "update_date",
    comment: "更新时间",
    length: 0,
  })
  @ApiProperty({ description: "更新时间" })
  updateDate: Date;
}
