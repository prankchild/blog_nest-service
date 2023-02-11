import { ReqListQuery } from '@/utils/req-list-query';
import { ApiProperty } from '@nestjs/swagger/dist';

export class FindRoleListDto extends ReqListQuery {
  @ApiProperty({ description: '角色名称模糊搜索', required: false })
  name?: string;
}
