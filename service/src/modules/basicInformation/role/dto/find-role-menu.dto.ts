import { ApiProperty } from "@nestjs/swagger";
export class FindRoleMenuDto {
  @ApiProperty({ type: String, description: "roleId" })
  roleId: string;
}
