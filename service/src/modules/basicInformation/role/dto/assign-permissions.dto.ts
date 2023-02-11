import { ApiProperty } from "@nestjs/swagger";
export class AssignPermissionsDto {
  @ApiProperty({ type: String, description: "roleId" })
  roleId: string;
  @ApiProperty({ type: Array, description: "menuIds" })
  menuIds: string[];
}
