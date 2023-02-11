import { Injectable, Inject } from '@nestjs/common';

import { UserEntity } from '../basicInformation/user/user.entity';
import { UserService } from '../basicInformation/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}
  async validateUser(payload: { id: string }): Promise<UserEntity> {
    // 根据用户 id 查出当前用户信息
    return await this.userService.findOneById(payload.id);
  }
}
