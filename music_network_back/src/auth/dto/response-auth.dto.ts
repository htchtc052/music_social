import { IntersectionType } from '@nestjs/swagger';
import { TokensResponse } from './response-tokens.dto';
import { UserResponse } from '../../users/dto/user-response.dto';

export class AuthResponse extends IntersectionType(TokensResponse) {
  user: UserResponse;
}
