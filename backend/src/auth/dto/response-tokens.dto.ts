import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TokensResponse {
  @ApiProperty()
  @Expose()
  accessToken: string;
  @ApiProperty()
  @Expose()
  refreshToken: string;

  constructor(partial?: Partial<TokensResponse>) {
    Object.assign(this, partial);
  }
}
