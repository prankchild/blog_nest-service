import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configuration } from "@/config/configuration";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_GUARD } from "@nestjs/core";

import { JwtAuthGuard } from "@/common/guards/auth.guard";

import { UserModule } from "@/modules/basicInformation/user/user.module";
import { AuthModule } from "@/modules/auth/auth.module";
import { RoleModule } from "@/modules/basicInformation/role/role.module";
import { CommonModule } from "./modules/common/common.module";
import { MenuModule } from "./modules/basicInformation/menu/menu.module";

@Module({
  imports: [
    // 配置nest-config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [`.env.${process.env.NODE_ENV}`, ".env"],
    }),
    // 配置TypeOrm
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dateStrings: true,
        autoLoadEntities: true,
        type: configService.get<any>("database.type"),
        host: configService.get<string>("database.host"),
        port: configService.get<number>("database.port"),
        username: configService.get<string>("database.username"),
        password: configService.get<string>("database.password"),
        database: configService.get<string>("database.database"),
        synchronize: configService.get<boolean>("database.synchronize"),
        logging: configService.get("database.logging"),
        timezone: configService.get("database.timezone"), // 时区
      }),
      inject: [ConfigService],
    }),
    // 基础模块
    UserModule,
    AuthModule,
    RoleModule,
    CommonModule,
    MenuModule,
  ],
  controllers: [],
  providers: [
    // 全局添加token权限
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
