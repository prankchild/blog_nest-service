import { StatusValue } from '@/common/enums/common.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsIn } from 'class-validator';
import { $enum } from 'ts-enum-util';

export class UpdateStatusDto {
  @ApiProperty({ description: '账号ID' })
  @IsString({ message: 'id 类型错误' })
  @IsNotEmpty({ message: '账号ID为空' })
  readonly id: string;

  @ApiProperty({
    description: '所属状态: 1-有效，0-禁用',
    enum: $enum(StatusValue).getValues(),
  })
  @IsNumber({}, { message: 'status 类型错误' })
  @IsNotEmpty({ message: 'status 不能为空' })
  @IsIn([0, 1], { message: 'status 可选值0/1，分别表示有效禁用' })
  readonly status: number;
}
