import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { AuthService } from '../users/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  register(@Body() createUserDto: RegisterUserDto) {
    return this.authService.create(createUserDto);
  }
}
