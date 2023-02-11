import { Inject, Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { compare, genSalt, hash } from "bcryptjs";
import { Repository, EntityManager, Like, DataSource } from "typeorm";
import { instanceToPlain, plainToInstance } from "class-transformer";

import { UserEntity } from "./user.entity";
import { ResultData } from "@/types/common/result";
import { validEmail, validPhone } from "@/utils/validator";
import { HttpCode } from "@/common/enums/code.enum";

import { CreateTokenDto } from "./dto/create-token.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserRoleService } from "./role/user-role.service";
import { RoleService } from "../role/role.service";
import { FindUserListDto } from "./dto/find-user.list.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserRoleEntity } from "./role/user-role.entity";
import { RoleMenuEntity } from "../role/role-menu.entity";
import { MenuEntity } from "../menu/menu.entity";
import { transformTree } from "@/utils/utils";
import _ from "lodash";
@Injectable()
export class UserService {
  constructor(
    // 数据库
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(UserRoleEntity)
    private readonly userRoleEntity: Repository<UserRoleEntity>,
    @InjectRepository(RoleMenuEntity)
    private readonly roleMenuEntity: Repository<RoleMenuEntity>,
    @InjectRepository(MenuEntity)
    private readonly menuEntity: Repository<MenuEntity>,
    private readonly dataSource: DataSource,
    @InjectEntityManager()
    private readonly userManager: EntityManager,
    // 系统默认配置
    private readonly config: ConfigService,
    // 导入JWT
    private readonly jwtService: JwtService,
    private readonly userRoleService: UserRoleService
  ) {}
  /**
   * 用户注册
   * @param dto
   */
  async create(dto: CreateUserDto): Promise<ResultData> {
    // ----  校验  ----
    // 确认两次输入密码一致
    if (dto.password !== dto.confirmPassword)
      return ResultData.fail(
        HttpCode.USER_PASSWORD_INVALID,
        "两次输入密码不一致，请重试"
      );
    if (await this.userEntity.findOne({ where: { account: dto.account } }))
      return ResultData.fail(
        HttpCode.USER_CREATE_EXISTING,
        "帐号已存在，请调整后重新注册！"
      );
    if (await this.userEntity.findOne({ where: { phone: dto.phone } }))
      return ResultData.fail(
        HttpCode.USER_CREATE_EXISTING,
        "当前手机号已存在，请调整后重新注册"
      );
    if (await this.userEntity.findOne({ where: { email: dto.email } }))
      return ResultData.fail(
        HttpCode.USER_CREATE_EXISTING,
        "当前邮箱已存在，请调整后重新注册"
      );
    // ----  校验完成  ----
    const salt = await genSalt();
    dto.password = await hash(dto.password, salt);
    // plainToInstance  忽略转换 @Exclude 装饰器
    const userInfo = plainToInstance(
      UserEntity,
      { salt, ...dto },
      { ignoreDecorators: true }
    );
    const result = this.userManager.transaction(
      async (transactionalEntityManager) => {
        return await transactionalEntityManager.save<UserEntity>(userInfo);
      }
    );
    return ResultData.success(instanceToPlain(result));
  }
  /**
   * 用户登录
   * @param account
   * @param password
   * @returns
   */
  async login(account: string, password: string): Promise<ResultData> {
    let userInfo = null;
    if (validPhone(account)) {
      // 手机登录
      userInfo = await this.userEntity.findOne({ where: { phone: account } });
    } else if (validEmail(account)) {
      // 邮箱登录
      userInfo = await this.userEntity.findOne({ where: { email: account } });
    } else {
      // 账号登录
      userInfo = await this.userEntity.findOne({ where: { account } });
    }
    // ----  校验  ----
    if (!userInfo)
      return ResultData.fail(HttpCode.USER_PASSWORD_INVALID, "帐号或密码错误");
    const checkPassword = await compare(password, userInfo.password);
    if (!checkPassword)
      return ResultData.fail(HttpCode.USER_PASSWORD_INVALID, "帐号或密码错误");
    if (userInfo.status === 0)
      return ResultData.fail(
        HttpCode.USER_ACCOUNT_FORBIDDEN,
        "您已被禁用，如需正常使用请联系管理员"
      );
    // ----  校验完成  ----
    // 生成Token
    const token = this.genToken({ id: userInfo.id });
    const user = instanceToPlain(userInfo);
    return ResultData.success(
      { ...token, ...user },
      `登录成功，欢迎${userInfo.account}`
    );
  }
  /**
   * 后台用户登录
   * @param account
   * @param password
   * @returns
   */
  async adminLogin(account: string, password: string): Promise<ResultData> {
    let userInfo = null;
    if (validPhone(account)) {
      // 手机登录
      userInfo = await this.userEntity.findOne({ where: { phone: account } });
    } else if (validEmail(account)) {
      // 邮箱登录
      userInfo = await this.userEntity.findOne({ where: { email: account } });
    } else {
      // 账号登录
      userInfo = await this.userEntity.findOne({ where: { account } });
    }
    // ----  校验  ----
    if (!userInfo)
      return ResultData.fail(HttpCode.USER_PASSWORD_INVALID, "帐号或密码错误");
    const checkPassword = await compare(password, userInfo.password);
    if (!checkPassword)
      return ResultData.fail(HttpCode.USER_PASSWORD_INVALID, "帐号或密码错误");
    if (userInfo.status === 0)
      return ResultData.fail(
        HttpCode.USER_ACCOUNT_FORBIDDEN,
        "您已被禁用，如需正常使用请联系管理员"
      );
    // 查询菜单
    const menuList: any = await this.dataSource
      .createQueryBuilder("nest_blog_user", "user")
      .leftJoinAndSelect(
        "nest_blog_user_role",
        "userRole",
        "userRole.user_id = user.id"
      )
      .leftJoinAndSelect("nest_blog_role", "role", "role.id = userRole.role_id")
      .leftJoinAndSelect(
        "nest_blog_role_menu",
        "roleMenu",
        "roleMenu.role_id = role.id"
      )
      .leftJoinAndSelect("nest_blog_menu", "menu", "menu.id = roleMenu.menu_id")
      .where("user.id = :userId", { userId: userInfo.id })
      .getRawMany();
    const menuEntityList = [];
    if (menuList[0]) {
      if (
        Number(menuList[0].role_available_range) === 0 ||
        menuList[0].role_available_range === null
      ) {
        return ResultData.fail(
          HttpCode.USER_ACCOUNT_FORBIDDEN,
          "您暂无该权限访问后台系统"
        );
      }
      // 判断是否有菜单权限，如若没有则无法进入页面
      if (!menuList[0].menu_id) {
        return ResultData.fail(
          HttpCode.USER_ACCOUNT_FORBIDDEN,
          "您暂无拥有菜单列表，无法访问后台系统"
        );
      }
    }

    for (const key in menuList) {
      menuEntityList.push({
        id: menuList[key]["menu_id"],
        menuName: menuList[key]["menu_menu_name"],
        menuType: menuList[key]["menu_menu_type"],
        menuCode: menuList[key]["menu_menu_code"],
        remark: menuList[key]["menu_remark"],
        menuStatus: menuList[key]["menu_menu_status"],
        parentId: menuList[key]["menu_parent_id"],
        menuPath: menuList[key]["menu_menu_path"],
        filePath: menuList[key]["menu_file_path"],
        sort: menuList[key]["menu_sort"],
        menuKey: menuList[key]["menu_menu_key"],
        createDate: menuList[key]["menu_create_date"],
        otherProperties: menuList[key]["menu_other_properties"],
      });
    }
    // 生成树
    const menus = transformTree(menuEntityList);
    // ----  校验完成  ----
    // 生成Token
    const token = this.genToken({ id: userInfo.id });
    const user = instanceToPlain(userInfo);
    return ResultData.success(
      { ...token, ...user, menus },
      `登录成功，欢迎${userInfo.account}`
    );
  }
  /**
   * 修改用户状态
   * @returns
   */
  async updateStatus(id: string, status: number): Promise<ResultData> {
    const existing = await this.findOneById(id);
    if (!existing)
      ResultData.fail(HttpCode.USER_NOT_FOUND, "当前用户不存在或已删除");
    const { affected } = await this.userManager.transaction(
      async (transactionalEntityManager) => {
        return await transactionalEntityManager.update<UserEntity>(
          UserEntity,
          id,
          { status }
        );
      }
    );
    if (!affected)
      ResultData.fail(HttpCode.SERVICE_ERROR, "更新失败，请稍后尝试");
    return ResultData.success(affected);
  }
  /**
   * 修改用户信息
   * @param dto
   * @returns
   */
  async update(dto: UpdateUserDto): Promise<ResultData> {
    const existing = await this.findOneById(dto.id);
    if (!existing)
      ResultData.fail(HttpCode.USER_NOT_FOUND, "当前用户不存在或已删除");
    const { affected } = await this.userManager.transaction(
      async (transactionalEntityManager) => {
        return await transactionalEntityManager.update<UserEntity>(
          UserEntity,
          dto.id,
          plainToInstance(UserEntity, dto)
        );
      }
    );
    if (!affected)
      return ResultData.fail(
        HttpCode.SERVICE_ERROR,
        "当前用户更新失败，请稍后尝试"
      );
    return ResultData.success(affected);
  }
  /**
   * 更改用户密码
   * @param id 用户ID
   * @param password 用户密码
   */
  async updatePassword(
    id: string,
    password: string,
    reset = false
  ): Promise<ResultData> {
    const existing = await this.userEntity.findOne({ where: { id } });
    if (!existing)
      return ResultData.fail(
        HttpCode.USER_NOT_FOUND,
        `用户不存在或已删除，${reset ? "重置" : "更新"}失败`
      );
    const newPassword = reset
      ? this.config.get("user.resetPassword")
      : password;

    const user = { id, password: await hash(newPassword, existing.salt) };

    const { affected } = await this.userManager.transaction(
      async (transactionalEntityManager) => {
        return await transactionalEntityManager.update<UserEntity>(
          UserEntity,
          id,
          user
        );
      }
    );
    if (!affected)
      return ResultData.fail(
        HttpCode.SERVICE_ERROR,
        `${reset ? "重置" : "更新"}失败，请稍后重试`
      );
    return ResultData.success();
  }
  /**
   * 根据用户ID查询信息
   * @param id
   * @returns
   */
  async getUserInfo(id: string): Promise<ResultData> {
    const existing = await this.findOneById(id);
    if (!existing)
      ResultData.fail(HttpCode.USER_NOT_FOUND, "当前用户不存在或已删除");
    return ResultData.success(instanceToPlain(existing));
  }
  /**
   * 查询用户列表
   * @param dto
   * @returns
   */
  async findList(dto: FindUserListDto): Promise<ResultData> {
    const { page = 1, size = 10, status, roleId, account } = dto;
    // 判断是否存在roleId的查询条件，如果存在则执行这一条查询语句
    if (roleId) {
      const result = await this.userRoleService.findUserByRoleId(
        roleId,
        page,
        size
      );
      return result;
    }
    const whereStatus = status ? `user.status = ${status}` : "";
    const whereAccount = account ? `user.account like '%${account}%'` : "";
    const where = {
      ...(status ? { status } : null),
      ...(account ? { account: Like(`%${account}%`) } : null),
    };
    const result = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        const users = await transactionalEntityManager
          .createQueryBuilder("nest_blog_user", "user")
          .orderBy("user.create_date", "DESC")
          .where(whereStatus)
          .where(whereAccount)
          .leftJoinAndSelect(
            "nest_blog_user_role",
            "ur",
            "ur.user_id = user.id"
          )
          .leftJoinAndSelect("nest_blog_role", "role", "role.id = ur.role_id")
          .skip(size * (page - 1))
          .take(size)
          .getRawMany();
        const total = await transactionalEntityManager.count(UserEntity, {
          where,
        });
        return { users, total };
      }
    );
    const users = result.users.map((v) => ({
      id: v.user_id, // 账户ID
      account: v.user_account, // 用户密码
      phone: v.user_phone, // 用户手机
      email: v.user_email, // 用户邮箱
      status: v.user_status, // 用户状态
      avatar: v.user_avatar, // 用户头像
      describe: v.user_describe, // 用户描述
      createDate: v.user_create_date, // 用户创建时间
      updateDate: v.user_update_date, // 用户修改时间
      roleId: v.role_id, // 角色ID
      roleName: v.role_name, // 角色名称
      roleRemark: v.role_remark, // 角色备注
      roleStatus: v.role_status, // 角色状态
      availableRange: v.role_available_range, // 可用范围
    }));
    return ResultData.success({ list: users, total: result.total });
  }
  async updateToken(): Promise<ResultData> {
    return ResultData.success("ok");
  }
  async findOneById(id: string): Promise<UserEntity> {
    return await this.userEntity.findOne({ where: { id } });
  }
  /**
   * 生成 token 与 刷新 token
   * @param payload
   * @returns
   */
  genToken(payload: { id: string }): CreateTokenDto {
    const accessToken = `Bearer ${this.jwtService.sign(payload)}`;
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get("jwt.refreshExpiresIn"),
    });
    return { accessToken, refreshToken };
  }
  /**
   * 刷新 token
   * @param id
   * @returns
   */
  refreshToken(id: string): string {
    return this.jwtService.sign({ id });
  }
  /** 校验 token */
  verifyToken(token: string): string {
    try {
      if (!token) return null;
      const id = this.jwtService.verify(token.replace("Bearer ", ""));
      return id;
    } catch (error) {
      return null;
    }
  }
}
