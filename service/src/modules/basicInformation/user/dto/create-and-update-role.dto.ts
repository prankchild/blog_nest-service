import { ApiProperty } from "@nestjs/swagger";
export class CreateAndUpdateRoleDto {
  @ApiProperty({ type: String, description: "用户ID" })
  userId: string;
  @ApiProperty({ type: String, description: "角色ID" })
  roleId: string;
}
