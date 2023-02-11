import { ApiProperty } from '@nestjs/swagger';
export class CreateTokenDto {
  @ApiProperty({ type: String, description: 'accessToken' })
  accessToken: string;
  @ApiProperty({ type: String, description: 'refreshToken' })
  refreshToken: string;
}
