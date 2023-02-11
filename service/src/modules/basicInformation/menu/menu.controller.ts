import { ApiResult } from "@/common/decorators/api-result.decorator";
import { ResultData } from "@/types/common/result";
import { Body, Controller, Post } from "@nestjs/common";
import { ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { MenuEntity } from "./menu.entity";
import { MenuService } from "./menu.service";

@ApiTags("菜单模块")
@Controller("menu")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post("createMenu")
  @ApiOperation({ summary: "创建菜单" })
  @ApiResult(MenuEntity)
  @ApiHeader({
    name: "Authorization",
    required: true,
    description: "本次请求请带上token",
  })
  async create(@Body() dto: CreateMenuDto): Promise<ResultData> {
    return await this.menuService.create(dto);
  }

  @Post("updateMenu")
  @ApiOperation({ summary: "创建菜单" })
  @ApiResult(MenuEntity)
  @ApiHeader({
    name: "Authorization",
    required: true,
    description: "本次请求请带上token",
  })
  async update(@Body() dto: UpdateMenuDto): Promise<ResultData> {
    return await this.menuService.update(dto);
  }

  @Post("findMenuList")
  @ApiOperation({ summary: "查询菜单列表" })
  @ApiResult(MenuEntity)
  @ApiHeader({
    name: "Authorization",
    required: true,
    description: "本次请求请带上token",
  })
  async findMenuList(): Promise<ResultData> {
    return await this.menuService.findList();
  }
}
