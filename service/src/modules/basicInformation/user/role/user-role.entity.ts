import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('nest_blog_user_role')
export class UserRoleEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint', name: 'user_id', comment: '用户id' })
  userId: string;

  @Column({ type: 'bigint', name: 'role_id', comment: '角色id' })
  roleId: string;
}
