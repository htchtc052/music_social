import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../users/dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: AuthService) {}

  async register(registerUserDto: RegisterUserDto) {
    const user: User = await this.usersService.create(registerUserDto);
    return {
      user,
    };
  }
}
