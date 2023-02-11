import { ApiResult } from "@/common/decorators/api-result.decorator";
import { HttpCode } from "@/common/enums/code.enum";
import { ResultData } from "@/types/common/result";
import { Body, Injectable, Post } from "@nestjs/common";
import { ApiHeader, ApiOperation } from "@nestjs/swagger";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { EntityManager, Repository } from "typeorm";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { MenuEntity } from "./menu.entity";
import { v4 as uuidV4 } from "uuid";
import _, { cloneDeep } from "lodash";
import { UpdateMenuDto } from "./dto/update-menu.dto";
@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuEntity: Repository<MenuEntity>,
    @InjectEntityManager()
    private readonly menuManager: EntityManager
  ) {}
  /**
   * 创建菜单
   * @param dto 菜单参数
   * @returns
   */
  async create(dto: CreateMenuDto): Promise<ResultData> {
    const menuCode = uuidV4();
    let otherProperties;
    if (dto.otherProperties) {
      otherProperties = JSON.parse(otherProperties);
    }
    const menu = plainToInstance(MenuEntity, {
      ...dto,
      menuCode,
      otherProperties,
    });
    console.log(menu, "menu");
    const result = await this.menuEntity.save(menu);
    if (!result) {
      return ResultData.fail(
        HttpCode.SERVICE_ERROR,
        "菜单添加失败，请重新尝试"
      );
    }
    return ResultData.success(result, "新增成功");
  }
  /**
   * 修改菜单
   * @param dto 菜单参数
   * @returns
   */
  async update(dto: UpdateMenuDto): Promise<ResultData> {
    const { id, otherProperties, ...menu } = dto;
    let otherPropertiesObj;
    if (otherProperties) {
      otherPropertiesObj = JSON.parse(otherProperties as string);
    } else {
      otherPropertiesObj = null;
    }
    const newMenu = plainToInstance(MenuEntity, {
      ...menu,
      otherProperties: otherPropertiesObj,
    });
    console.log(menu, "menu");
    const result = await this.menuEntity.update(id, newMenu);
    if (!result) {
      return ResultData.fail(
        HttpCode.SERVICE_ERROR,
        "菜单修改失败，请重新尝试"
      );
    }
    return ResultData.success(result, "修改成功");
  }
  /**
   * 查询列表
   * @returns
   */
  async findList(): Promise<ResultData> {
    const flatMenuList = await this.menuEntity.find();
    // 修改每条数据的格式
    const original = instanceToPlain(flatMenuList);
    // .map((item) => {
    //     const { key, otherProperties, ...data } = item;
    //     data.meta = {
    //       key,
    //       ...otherProperties,
    //       title: item.menuName,
    //     };
    //     return data;
    //   });
    // flatToTree(original);
    return ResultData.success(transformTree(original));
  }
}
function transformTree(original: any) {
  const parents = original.filter((item: any) => item.parentId === null);
  const children = original.filter((item: any) => item.parentId !== null);
  tree(parents, children);
  function tree(parents, children) {
    for (let index = 0; index < parents.length; index++) {
      const parent = parents[index];
      for (let subIndex = 0; subIndex < children.length; subIndex++) {
        const child = children[subIndex];
        if (Number(child.parentId) === Number(parent.id)) {
          const _children = _.cloneDeep(children);
          _children.splice(subIndex, 1);
          if (parent.children) {
            parent.children = [...tree([child], _children), ...parent.children];
          } else {
            parent.children = [...tree([child], _children)];
          }
        }
      }
      if (parent.children && parent.children.length) {
        const parentChildren = cloneDeep(parent.children);
        parent.children = _.sortBy(parentChildren, (o) => {
          return o.sort;
        });
      }
    }
    return parents;
  }
  return parents;
}
