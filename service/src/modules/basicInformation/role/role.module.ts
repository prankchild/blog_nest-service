import { Module } from "@nestjs/common/decorators";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserRoleEntity } from "../user/role/user-role.entity";
import { RoleMenuEntity } from "./role-menu.entity";
import { RoleEntity } from "./role.entity";

import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";
import { MenuEntity } from "../menu/menu.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleEntity,
      RoleMenuEntity,
      UserRoleEntity,
      MenuEntity,
    ]),
  ],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
