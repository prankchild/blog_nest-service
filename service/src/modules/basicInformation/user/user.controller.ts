import { AllowAnon } from "@/common/decorators/allow-anon.decorator";
import { ApiResult } from "@/common/decorators/api-result.decorator";
import { ResultData } from "@/types/common/result";
import { Controller, Post, Query, Get } from "@nestjs/common";
import { Body } from "@nestjs/common/decorators";
import { ApiOperation, ApiTags, ApiHeader } from "@nestjs/swagger";

import { FindUserListDto } from "./dto/find-user.list.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserRoleService } from "./role/user-role.service";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";
import { CreateAndUpdateRoleDto } from "./dto/create-and-update-role.dto";

@ApiTags("用户模块")
@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService
  ) {}

  @Post("createAndUpdateRole")
  @ApiOperation({ summary: "分配用户角色" })
  @ApiResult(UserEntity)
  @ApiHeader({
    name: "Authorization",
    required: true,
    description: "本次请求请带上token",
  })
  async createAndUpdateRole(
    @Body() dto: CreateAndUpdateRoleDto
  ): Promise<ResultData> {
    return await this.userRoleService.createAndUpdateRole(
      dto.userId,
      dto.roleId
    );
  }
  @Post("update")
  @ApiOperation({ summary: "修改用户信息" })
  @ApiResult(UserEntity)
  @ApiHeader({
    name: "Authorization",
    required: true,
    description: "本次请求请带上token",
  })
  async update(@Body() dto: UpdateUserDto): Promise<ResultData> {
    return await this.userService.update(dto);
  }
  @Post("updateStatus")
  @ApiOperation({ summary: "修改用户状态" })
  @ApiResult(UserEntity)
  @ApiHeader({
    name: "Authorization",
    required: true,
    description: "本次请求请带上token",
  })
  async updateStatus(@Body() dto: UpdateStatusDto): Promise<ResultData> {
    return await this.userService.updateStatus(dto.id, dto.status);
  }
  @Post("updatePassword")
  @ApiOperation({ summary: "修改用户密码" })
  @ApiResult(UserEntity)
  @ApiHeader({
    name: "Authorization",
    required: true,
    description: "本次请求请带上token",
  })
  async updatePassword(@Body() dto: UpdatePasswordDto): Promise<ResultData> {
    return await this.userService.updatePassword(
      dto.id,
      dto.password,
      dto.reset
    );
  }
  @Get("getUserInfo")
  @ApiOperation({ summary: "根据用户ID查询信息" })
  @ApiResult(UserEntity)
  @ApiHeader({
    name: "Authorization",
    required: true,
    description: "本次请求请带上token",
  })
  async getUserInfo(@Query("id") id: string): Promise<ResultData> {
    return await this.userService.getUserInfo(id);
  }
  @Post("findUserList")
  @ApiOperation({ summary: "查询用户列表" })
  async findUser(@Body() dto: FindUserListDto): Promise<ResultData> {
    return await this.userService.findList(dto);
  }
}
