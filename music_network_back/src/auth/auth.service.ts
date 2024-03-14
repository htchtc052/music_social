import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(registerUserDto: RegisterUserDto) {
    const user: User = await this.usersService.create(registerUserDto);
    return {
      user,
    };
  }
}
