import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Repository, EntityManager, Like } from "typeorm";
import { instanceToPlain, plainToInstance } from "class-transformer";

import { RoleEntity } from "./role.entity";

import { ResultData } from "@/types/common/result";
import { HttpCode } from "@/common/enums/code.enum";

import { RoleMenuEntity } from "./role-menu.entity";
import { UserRoleEntity } from "../user/role/user-role.entity";

import { FindRoleListDto } from "./dto/find-role.dto";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { MenuEntity } from "../menu/menu.entity";

@Injectable()
export class RoleService {
  constructor(
    // 数据库
    @InjectRepository(RoleEntity)
    private readonly roleEntity: Repository<RoleEntity>,
    @InjectRepository(RoleMenuEntity)
    private readonly roleMenuEntity: Repository<RoleMenuEntity>,
    @InjectRepository(MenuEntity)
    private readonly menuEntity: Repository<MenuEntity>,
    @InjectRepository(UserRoleEntity)
    private readonly userRoleEntity: Repository<UserRoleEntity>,
    @InjectEntityManager()
    private readonly roleManager: EntityManager,
    // 系统默认配置
    private readonly config: ConfigService
  ) {}
  /**
   * 创建用户角色
   * @param dto 角色参数
   * @param user 用户参数
   * @returns
   */
  async create(dto: CreateRoleDto): Promise<ResultData> {
    const createRole = {
      available_range: dto.availableRange,
      ...(dto.name ? { name: dto.name } : null),
      ...(dto.remark ? { remark: dto.remark } : null),
      ...(dto.menuIds ? { menuIds: dto.menuIds } : []),
    };
    const role = plainToInstance(RoleEntity, createRole);
    const res = await this.roleManager.transaction(
      async (transactionalEntityManager) => {
        // 先创建角色
        const result = await transactionalEntityManager.save<RoleEntity>(
          plainToInstance(RoleEntity, role)
        );
        if (result) {
          // 角色创建成功创建菜单与角色的对应

          const roleMenus = plainToInstance(
            RoleMenuEntity,
            dto.menuIds.map((menuId) => {
              return { menuId, roleId: result.id };
            })
          );
          await transactionalEntityManager.save<RoleMenuEntity>(roleMenus);
        }
        return result;
      }
    );
    if (!res)
      return ResultData.fail(
        HttpCode.SERVICE_ERROR,
        "角色创建失败，请稍后重试"
      );
    return ResultData.success(res, "创建用户成功");
  }
  /**
   * 分配角色权限
   * @param roleId
   * @param menuIds
   * @returns
   */
  async assignPermissions(
    roleId: string,
    menuIds: string[]
  ): Promise<ResultData> {
    const roleMenuList = plainToInstance(
      RoleMenuEntity,
      menuIds.map((menuId) => {
        return { roleId, menuId };
      })
    );
    const result = await this.roleManager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.delete(RoleMenuEntity, { roleId });
        return await transactionalEntityManager.save<RoleMenuEntity>(
          roleMenuList
        );
      }
    );
    if (!result) {
      return ResultData.fail(HttpCode.SERVICE_ERROR, "分配角色权限失败");
    }
    return ResultData.success(result, "分配角色权限成功");
  }
  /**
   * 删除用户角色
   * @param id 删除的角色ID
   * @returns
   */
  async delete(id: string): Promise<ResultData> {
    const existing = await this.roleEntity.findOne({ where: { id } });
    if (!existing)
      return ResultData.fail(
        HttpCode.ROLE_NOT_FOUND,
        "当前角色不存在或已被删除"
      );
    const existingBindUser = await this.userRoleEntity.findOne({
      where: { roleId: id },
    });
    if (existingBindUser)
      return ResultData.fail(
        HttpCode.ROLE_NOT_DEL,
        "当前角色还有绑定的用户，需要解除关联后删除"
      );
    const { affected } = await this.roleManager.transaction(
      async (transactionalEntityManager) => {
        // 首先删除 role --- menu 的数据
        await transactionalEntityManager.delete(RoleMenuEntity, { roleId: id });
        // 其次删除 role --- user 的数据
        // await transactionalEntityManager.delete(UserRoleEntity, { role: id });
        // 最后删除 role
        return await transactionalEntityManager.delete<RoleEntity>(
          RoleEntity,
          id
        );
      }
    );
    if (!affected)
      return ResultData.fail(HttpCode.SERVICE_ERROR, "删除失败，请稍后重试");
    return ResultData.success("ok", "删除用户成功");
  }
  /**
   * 更改用户角色
   * @param dto 角色参数
   * @returns
   */
  async update(dto: UpdateRoleDto): Promise<ResultData> {
    const existing = await this.roleEntity.findOne({ where: { id: dto.id } });
    if (!existing)
      return ResultData.fail(
        HttpCode.ROLE_NOT_FOUND,
        "当前角色不存在或已被删除"
      );
    const { affected } = await this.roleManager.transaction(
      async (transactionalEntityManager) => {
        if (dto.menuIds) {
          // 1.对于该角色对应得菜单进行删除
          await transactionalEntityManager.delete(RoleMenuEntity, {
            roleId: dto.id,
          });
          // 判断dto.menuIds长度
          if (dto.menuIds.length) {
            const roleMenus = plainToInstance(
              RoleMenuEntity,
              dto.menuIds.map((menuId) => {
                return { menuId, roleId: dto.id };
              })
            );
            // 2.新增返回回来的菜单
            await transactionalEntityManager.save<RoleMenuEntity>(roleMenus);
          }
        }
        // 3.更改角色信息
        const updateRole = {
          id: dto.id,
          available_range: dto.availableRange,
          ...(dto.name ? { name: dto.name } : null),
          ...(dto.remark ? { remark: dto.remark } : null),
        };
        return await transactionalEntityManager.update<RoleEntity>(
          RoleEntity,
          dto.id,
          plainToInstance(RoleEntity, updateRole)
        );
      }
    );

    if (!affected)
      return ResultData.fail(
        HttpCode.SERVICE_ERROR,
        "当前角色更新失败，请稍后尝试"
      );
    return ResultData.success(affected, "更改用户信息成功");
  }

  /**
   * 查询角色列表
   * @param dto 查询角色列表条件
   * @returns
   */
  async findList(dto: FindRoleListDto): Promise<ResultData> {
    const { page = 1, size = 10, name } = dto;
    const where = { ...(name ? { name: Like(`%${name}%`) } : null) };
    const roleList = await this.roleEntity.findAndCount({
      where,
      order: { createDate: "DESC" },
      skip: size * (page - 1),
      take: size,
    });
    return ResultData.success({
      list: instanceToPlain(roleList[0]),
      total: roleList[1],
    });
  }
  /**
   * 查询角色权限
   * @param roleId
   * @returns
   */
  async findRoleMenu(roleId: string): Promise<ResultData> {
    const result = await this.roleMenuEntity.find({
      where: { roleId },
    });
    // 输出一个数组不包含父元素
    const noParent = [];
    let menuIds = [];
    if (result && result.length) {
      menuIds = instanceToPlain(result).map((item) => {
        return item.menuId;
      });
      // 查询菜单列表
      const menuList = instanceToPlain(await this.menuEntity.find()) || [];
      for (const key in menuIds) {
        const idx = menuList.findIndex(
          (item) => Number(item.parentId) === Number(menuIds[key])
        );
        if (idx === -1) {
          noParent.push(menuIds[key]);
        }
      }
    }
    if (!result) {
      return ResultData.fail(HttpCode.SERVICE_ERROR, "查询角色权限失败");
    }
    console.log(noParent, "noParent");
    return ResultData.success({
      allList: menuIds,
      filterList: noParent,
    });
  }
  // async find
  async getRoleEnum(): Promise<ResultData> {
    const result = await this.roleEntity.findBy({});
    return ResultData.success(result);
  }
  // async getLoginRoleMenu(roleId: string): Promise<any> {
  //   const result = await this.roleMenuEntity.find({
  //     where: { roleId },
  //   });
  //   const menuIds = instanceToPlain(result).map((item) => {
  //     return item.menuId;
  //   });
  //   return;
  // }
}
