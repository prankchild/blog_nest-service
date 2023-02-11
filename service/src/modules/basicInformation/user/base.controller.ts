import { Body, Controller, Post, Req } from "@nestjs/common";
import { ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ResultData } from "@/types/common/result";
import { UserEntity } from "./user.entity";

import { CreateTokenDto } from "./dto/create-token.dto";
import { UserService } from "./user.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiResult } from "@/common/decorators/api-result.decorator";
import { AllowAnon } from "@/common/decorators/allow-anon.decorator";

@ApiTags("登录与注册")
@ApiExtraModels(ResultData, UserEntity, CreateTokenDto)
@Controller()
export class BaseController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  @ApiOperation({ summary: "用户注册" })
  @ApiResult(UserEntity)
  @AllowAnon()
  async register(@Body() dto: CreateUserDto): Promise<ResultData> {
    return await this.userService.create(dto);
  }

  @Post("login")
  @ApiOperation({ summary: "用户登录" })
  @ApiResult(CreateTokenDto)
  @AllowAnon()
  async login(@Body() dto: LoginUserDto): Promise<ResultData> {
    return await this.userService.login(dto.account, dto.password);
  }

  // @Post('/update/token')
  // @ApiOperation({ summary: '刷新Token' })
  // async updateToken(@Req() req): Promise<ResultData> {
  //   return await this.userService.updateToken(req.user.id);
  // }
}
