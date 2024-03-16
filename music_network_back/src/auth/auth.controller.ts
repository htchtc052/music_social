import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SerializerInterceptor } from '../serializer.interceptor';
import { UserResponse } from '../users/dto/response-user.dto';
import { User } from '@prisma/client';
import { AuthUser } from './auth-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessTokenGuard } from './guards/access-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UseInterceptors(SerializerInterceptor)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UseInterceptors(SerializerInterceptor)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('/me')
  @UseInterceptors(SerializerInterceptor)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async me(@AuthUser() user: User): Promise<UserResponse> {
    return new UserResponse(user);
  }
}
