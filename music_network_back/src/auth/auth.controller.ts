import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: UsersService) {}

  @Post('register')
  register(@Body() createUserDto: RegisterUserDto) {
    return this.authService.create(createUserDto);
  }
}
