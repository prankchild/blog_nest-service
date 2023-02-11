import { Module } from "@nestjs/common/decorators";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleModule } from "../basicInformation/role/role.module";
import { RoleService } from "../basicInformation/role/role.service";
import { CommonController } from "./common.controller";
@Module({
  imports: [TypeOrmModule.forFeature([]), RoleModule],
  providers: [],
  controllers: [CommonController],
  exports: [],
})
export class CommonModule {}
