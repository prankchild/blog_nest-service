import { ApiProperty } from "@nestjs/swagger";
import { StatusValue } from "@/common/enums/common.enum";

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from "typeorm";
import { ToInteger } from "@/common/decorators/tointeger";

@Entity("nest_blog_menu")
export class MenuEntity {
  @ApiProperty({ description: "id" })
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: string;

  @ApiProperty({ description: "菜单名称" })
  @Column({
    type: "varchar",
    length: 100,
    name: "menu_name",
    comment: "菜单名称",
  })
  menuName: string;

  @ApiProperty({
    description: "菜单类型（0-菜单夹 1-普通页面 2-tab页 3-按钮）",
  })
  @Column({
    type: "tinyint",
    name: "menu_type",
    comment: "菜单类型",
  })
  menuType: string;

  @ApiProperty({ description: "菜单编码" })
  @Column({
    type: "varchar",
    name: "menu_code",
    length: 100,
    comment: "菜单编码",
  })
  menuCode: string;

  @ApiProperty({ description: "菜单备注" })
  @Column({
    type: "varchar",
    length: 100,
    default: "",
    comment: "菜单备注",
    nullable: true,
  })
  remark: string;

  @ApiProperty({ description: "状态" })
  @Column({
    type: "tinyint",
    name: "menu_status",
    comment: "状态",
    default: StatusValue.NORMAL,
  })
  menuStatus: string;

  @ApiProperty({ description: "上级菜单" })
  @Column({
    type: "tinyint",
    name: "parent_id",
    default: 0,
    nullable: true,
    comment: "上级菜单ID",
  })
  parentId: string;

  @ApiProperty({ description: "跳转路径" })
  @Column({
    type: "varchar",
    length: 100,
    name: "menu_path",
    comment: "跳转路径",
    nullable: true,
  })
  menuPath: string;

  @ApiProperty({ description: "路由文件路径" })
  @Column({
    type: "varchar",
    name: "file_path",
    comment: "路由文件路径",
    nullable: true,
  })
  filePath: string;

  @ApiProperty({ description: "排序" })
  @Column({
    type: "tinyint",
    comment: "排序",
    nullable: true,
  })
  sort: string;

  @ApiProperty({ description: "键值" })
  @Column({
    type: "varchar",
    comment: "键值",
    name: "menu_key",
  })
  menuKey: string;

  @ApiProperty({ description: "其他属性" })
  @Column({
    type: "json",
    name: "other_properties",
    comment: "其他属性",
    nullable: true,
  })
  otherProperties?: string;

  @CreateDateColumn({
    type: "datetime",
    name: "create_date",
    comment: "创建时间",
    length: 0,
  })
  @ApiProperty({ description: "创建时间" })
  createDate: Timestamp;

  @UpdateDateColumn({
    type: "datetime",
    name: "update_date",
    comment: "更新时间",
    length: 0,
  })
  @ApiProperty({ description: "更新时间" })
  updateDate: Timestamp;
}
