import { ApiResult } from "@/common/decorators/api-result.decorator";
import { ResultData } from "@/types/common/result";
import { Controller } from "@nestjs/common";
import { Body, Post, Req, Param, Get } from "@nestjs/common/decorators/http";
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiExtraModels,
  ApiBearerAuth,
  ApiHeader,
} from "@nestjs/swagger";
import { AssignPermissionsDto } from "./dto/assign-permissions.dto";

import { CreateRoleDto } from "./dto/create-role.dto";
import { FindRoleMenuDto } from "./dto/find-role-menu.dto";
import { FindRoleListDto } from "./dto/find-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { RoleEntity } from "./role.entity";
import { RoleService } from "./role.service";

@ApiTags("角色模块")
@ApiBearerAuth()
@ApiExtraModels(RoleEntity)
@Controller("role")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post("createRole")
  @ApiOperation({ summary: "创建角色" })
  @ApiResult(RoleEntity)
  @ApiHeader({
    name: "Authorization",
    required: true,
    description: "本次请求请带上token",
  })
  async create(@Body() dto: CreateRoleDto): Promise<ResultData> {
    return await this.roleService.create(dto);
  }

  @Post("assignPermissions")
  @ApiOperation({ summary: "分配角色权限" })
  @ApiResult(RoleEntity)
  @ApiHeader({
    name: "Authorization",
    required: true,
    description: "本次请求请带上token",
  })
  async assignPermissions(
    @Body() dto: AssignPermissionsDto
  ): Promise<ResultData> {
    return await this.roleService.assignPermissions(dto.roleId, dto.menuIds);
  }

  @Post("findRoleMenu")
  @ApiOperation({ summary: "查询角色菜单权限" })
  @ApiResult(RoleEntity)
  @ApiHeader({
    name: "Authorization",
    required: true,
    description: "本次请求请带上token",
  })
  async findRoleMenu(@Body() dto: FindRoleMenuDto): Promise<ResultData> {
    return await this.roleService.findRoleMenu(dto.roleId);
  }

  @Post("deleteRole")
  @ApiOperation({ summary: "删除角色" })
  @ApiResult()
  @ApiHeader({
    name: "Authorization",
    required: true,
    description: "本次请求请带上token",
  })
  async delete(@Param("id") id: string): Promise<ResultData> {
    return await this.roleService.delete(id);
  }

  @Post("updateRole")
  @ApiOperation({ summary: "更改角色信息" })
  @ApiResult(RoleEntity)
  @ApiHeader({
    name: "Authorization",
    required: true,
    description: "本次请求请带上token",
  })
  async update(@Body() dto: UpdateRoleDto): Promise<ResultData> {
    return await this.roleService.update(dto);
  }

  @Post("findRoleList")
  @ApiOperation({ summary: "查询角色列表" })
  @ApiResult(RoleEntity, true)
  @ApiHeader({
    name: "Authorization",
    required: true,
    description: "本次请求请带上token",
  })
  async findList(@Body() dto: FindRoleListDto): Promise<ResultData> {
    return await this.roleService.findList(dto);
  }
}
