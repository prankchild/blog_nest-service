import { HttpCode } from "@/common/enums/code.enum";
import { ResultData } from "@/types/common/result";
import { Injectable, Inject } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { DataSource, Repository, EntityManager } from "typeorm";
import { RoleEntity } from "../../role/role.entity";
import { UserEntity } from "../user.entity";
import { UserRoleEntity } from "./user-role.entity";

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRoleEntity)
    private readonly userRoleEntity: Repository<UserRoleEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleEntity: Repository<RoleEntity>,
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    private readonly dataSource: DataSource,
    @InjectEntityManager()
    private readonly userRoleManager: EntityManager
  ) {}

  async createUserRole(roleId: string, userId: string): Promise<ResultData> {
    // const roleExisting = await this.roleEntity.findOneBy({ id: roleId });
    // if (!roleExisting)
    //   return ResultData.fail(
    //     HttpCode.ROLE_NOT_FOUND,
    //     '当前角色不存在或已被删除',
    //   );
    return ResultData.success();
  }
  /**
   *
   * @param roleId
   * @param page
   * @param size
   * @returns
   */
  async findUserByRoleId(roleId: string, page: number, size: number) {
    const result = await this.dataSource
      .createQueryBuilder("nest_blog_user", "bu")
      .where((qb: any) => {
        const subQuery = qb
          .subQuery()
          .select(["ur.user_id"])
          .from("nest_blog_user_role", "ur")
          .where("ur.role_id = :roleId", { roleId })
          .getQuery();
        console.log(subQuery, "subQuery");

        return `bu.status = 1 and bu.id in ${subQuery}`;
      })
      // .where((qb: any) => {
      //   const subQuery = qb
      //     .subQuery()
      //     .select(['ur.user_id'])
      //     .from('nest_blog_user_role', 'ur')
      //     .where('ur.role_id = :roleId', { roleId })
      //     .getQuery();
      //   const result = `bu.status = 1 and bu.id in ${subQuery}`;
      //   return result;
      // })
      .skip(size * (page - 1))
      .take(size)
      .getManyAndCount();

    return ResultData.success({
      list: instanceToPlain(result[0]),
      total: result[1],
    });
  }
  // 创建或编辑用户角色
  async createAndUpdateRole(userId: string, roleId: string) {
    const userExisting = await this.userEntity.findOneBy({ id: userId });
    const roleExisting = await this.roleEntity.findOneBy({ id: roleId });
    console.log(roleExisting, "roleExisting");
    if (!userExisting)
      return ResultData.fail(HttpCode.USER_NOT_FOUND, "当前用户不存在或已删除");

    if (!roleExisting)
      return ResultData.fail(HttpCode.USER_NOT_FOUND, "当前角色不存在或已删除");
    const result = await this.userRoleManager.transaction(
      async (transactionalEntityManager) => {
        // 先判断用户是否已有角色
        const isHasRole = await transactionalEntityManager.findOne(
          UserRoleEntity,
          { where: { userId } }
        );
        if (isHasRole) {
          await transactionalEntityManager.delete(UserRoleEntity, { userId });
        }
        const userRole = plainToInstance(UserRoleEntity, { roleId, userId });
        return await transactionalEntityManager.save(userRole);
      }
    );
    return ResultData.success(result);
  }
}
