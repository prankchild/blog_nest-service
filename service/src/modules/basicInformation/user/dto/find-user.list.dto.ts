import { StatusValue } from '@/common/enums/common.enum';
import { ReqListQuery } from '@/utils/req-list-query';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsIn } from 'class-validator';
import { $enum } from 'ts-enum-util';

export class FindUserListDto extends ReqListQuery {
  @ApiProperty({
    description: '所属状态: 1-有效，0-禁用',
    enum: $enum(StatusValue).getValues(),
  })
  readonly status?: number;

  @ApiProperty({ description: '拥有角色id', required: false })
  readonly roleId?: string;

  @ApiProperty({ description: '账号模糊搜索', required: false })
  readonly account?: string;
}
