import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { TokensResponse } from './dto/response-tokens.dto';
import { AuthResponse } from './dto/response-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @UseInterceptors(SerializerInterceptor)
  register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @UseInterceptors(SerializerInterceptor)
  login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Get('/me')
  @UseInterceptors(SerializerInterceptor)
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  async me(@AuthUser() user: User): Promise<UserResponse> {
    return new UserResponse(user);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-tokens')
  @ApiUnauthorizedResponse()
  @ApiOkResponse()
  @ApiBearerAuth()
  refreshTokens(@AuthUser() user: User): Promise<TokensResponse> {
    return this.authService.createNewTokens(user.id);
  }
}
