import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { UserController } from "./user.controller";
import { BaseController } from "./base.controller";

import { UserEntity } from "./user.entity";
import { UserRoleEntity } from "./role/user-role.entity";

import { UserService } from "./user.service";
import { AuthModule } from "@/modules/auth/auth.module";
import { UserRoleService } from "./role/user-role.service";
import { RoleEntity } from "../role/role.entity";
import { RoleMenuEntity } from "../role/role-menu.entity";
import { RoleService } from "../role/role.service";
import { MenuEntity } from "../menu/menu.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserRoleEntity,
      RoleEntity,
      RoleMenuEntity,
      MenuEntity,
    ]),
    forwardRef(() => AuthModule),
    // 配置JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("jwt.secretKey"),
        signOptions: {
          expiresIn: configService.get<string>("jwt.expiresIn"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController, BaseController],
  providers: [UserService, UserRoleService],
  exports: [UserService, UserRoleService],
})
export class UserModule {}
