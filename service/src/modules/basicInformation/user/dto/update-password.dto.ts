import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ description: '账号ID' })
  @IsString({ message: 'id 类型错误' })
  @IsNotEmpty({ message: '账号ID为空' })
  readonly id: string;

  @ApiProperty({ description: '密码' })
  @IsString({ message: '密码 类型错误' })
  @IsNotEmpty({ message: 'status 不能为空' })
  readonly password: string;

  readonly reset?: boolean;
}
