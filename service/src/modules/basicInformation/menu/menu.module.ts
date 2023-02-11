import { Module } from "@nestjs/common/decorators";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleMenuEntity } from "../role/role-menu.entity";
import { MenuController } from "./menu.controller";
import { MenuEntity } from "./menu.entity";
import { MenuService } from "./menu.service";

@Module({
  imports: [TypeOrmModule.forFeature([RoleMenuEntity, MenuEntity])],
  providers: [MenuService],
  controllers: [MenuController],
  exports: [MenuService],
})
export class MenuModule {}
