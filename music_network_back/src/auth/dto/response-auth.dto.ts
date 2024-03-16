import { IntersectionType } from '@nestjs/swagger';
import { TokensResponse } from './response-tokens.dto';
import { UserResponse } from '../../users/dto/response-user.dto';

export class AuthResponse extends IntersectionType(TokensResponse) {
  user: UserResponse;
}
