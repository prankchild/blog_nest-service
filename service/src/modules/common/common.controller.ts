import { AllowAnon } from "@/common/decorators/allow-anon.decorator";
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

import { RoleService } from "../basicInformation/role/role.service";

@ApiTags("公告模块")
@ApiBearerAuth()
@Controller("common")
export class CommonController {
  constructor(private readonly roleService: RoleService) {}

  @Get("getRoleEnum")
  @ApiOperation({ summary: "获取角色枚举" })
  @ApiResult()
  @AllowAnon()
  @ApiHeader({
    name: "Authorization",
    required: true,
    description: "本次请求请带上token",
  })
  async getRoleEnum(): Promise<ResultData> {
    return await this.roleService.getRoleEnum();
  }
}
