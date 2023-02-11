import { ToInteger } from "@/common/decorators/tointeger";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateMenuDto {
  @ApiProperty({ description: "id" })
  @IsString({ message: "id 类型错误，正确类型 number" })
  @IsNotEmpty({ message: "id 不能为空" })
  id: string;

  @ApiProperty({ description: "菜单名称", required: false })
  @IsString({ message: "菜单名称 类型错误，正确类型 string" })
  @IsEmail()
  @IsOptional()
  readonly menuName: string;

  @ApiProperty({ description: "菜单备注", required: false })
  @IsString({ message: "菜单备注 类型错误，正确类型 string" })
  @IsOptional()
  readonly remark?: string;

  @ApiProperty({ description: "菜单类型", required: false })
  @IsString({ message: "menuType 类型错误，正确类型 string" })
  @IsOptional()
  readonly menuType: string;

  @ApiProperty({ description: "上级菜单", required: false })
  @IsString({ message: "parentId 类型错误，正确类型 string" })
  @IsOptional()
  @ToInteger()
  readonly parentId?: string;

  @ApiProperty({ description: "跳转路径", required: false })
  @IsString({ message: "跳转路径 类型错误，正确类型 string" })
  @IsOptional()
  readonly menuPath?: string;

  @ApiProperty({ description: "状态", required: false })
  @IsString({ message: "menuStatus 类型错误，正确类型 string" })
  @IsOptional()
  readonly menuStatus: string;

  @ApiProperty({ description: "路由文件路径", required: false })
  @IsString({ message: "filePath 类型错误，正确类型 string" })
  @IsOptional()
  readonly filePath?: string;

  @ApiProperty({ description: "排序", required: false })
  @IsString({ message: "sort 类型错误，正确类型 string" })
  @IsOptional()
  @ToInteger()
  readonly sort?: string;

  @ApiProperty({ description: "键值", required: false })
  @IsString({ message: "key 类型错误，正确类型 string" })
  @IsOptional()
  readonly key?: string;

  @ApiProperty({ description: "其他属性", required: false })
  @IsString({ message: "otherProperties 类型错误，正确类型 string" })
  @IsOptional()
  readonly otherProperties?: JSON | string;
}
