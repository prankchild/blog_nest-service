import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Length,
  IsOptional,
  IsArray,
  IsNumber,
  IsNotEmpty,
  IsIn,
} from 'class-validator';
import { $enum } from 'ts-enum-util';

import { AvailableRange } from '@/common/enums/common.enum';

export class UpdateRoleDto {
  @ApiProperty({ description: 'id' })
  @IsString({ message: 'id 类型错误，正确类型 number' })
  @IsNotEmpty({ message: 'id 不能为空' })
  id: string;

  @ApiProperty({ description: '角色名称' })
  @IsString({ message: 'name 类型错误, 正确类型 string' })
  @IsNotEmpty({ message: 'name 不能为空' })
  @Length(2, 20, { message: 'name 字符长度在 2~20' })
  name: string;

  @ApiProperty({
    description: '可用范围: 1-后台管理系统，0-博客页面，2全部',
    enum: $enum(AvailableRange).getValues(),
  })
  @IsNumber({}, { message: 'status 类型错误' })
  @IsNotEmpty({ message: 'status 不能为空' })
  @IsIn([0, 1, 2], {
    message: 'status 可选值0/1/2，分别表示1-后台管理系统，0-博客页面，2全部',
  })
  availableRange: string;

  @ApiProperty({ description: '角色备注', required: false })
  @IsString({ message: 'remark 类型错误, 正确类型 string' })
  @Length(0, 100, { message: 'remark 字符长度在 0~100' })
  @IsOptional()
  remark?: string;

  @ApiProperty({ description: '当前角色所拥有的菜单组' })
  @IsArray({ message: 'menuIds 类型错误，正确类型 string[]' })
  @IsString({ each: true, message: '菜单组内类型错误' })
  @IsNotEmpty({ each: true, message: '菜单id 不能为空' })
  menuIds: string[];
}
