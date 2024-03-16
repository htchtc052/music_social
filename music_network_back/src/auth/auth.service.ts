import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { TokensResponse } from './dto/response-tokens.dto';
import * as bcrypt from 'bcrypt';
import TokenPayload from './types/token-payload';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserResponse } from '../users/dto/response-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user: User = await this.usersService.create(registerDto);

    const tokensResponse: TokensResponse = await this.generateTokens(user.id);

    return {
      ...tokensResponse,
      user: new UserResponse(user),
    };
  }

  async login(loginDto: LoginDto) {
    const user: User = await this.usersService.findByEmail(loginDto.email);

    const passwordIsValid = await this.validatePassword(
      user.password,
      loginDto.password,
    );

    if (!user || !passwordIsValid) {
      throw new BadRequestException('INVALID_CREDENTIALS');
    }

    const tokensResponse: TokensResponse = await this.generateTokens(user.id);

    return {
      ...tokensResponse,
      user: new UserResponse(user),
    };
  }

  async generateTokens(userId: number): Promise<TokensResponse> {
    const jwtPayload: TokenPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '30s',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '2m',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async validatePassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
