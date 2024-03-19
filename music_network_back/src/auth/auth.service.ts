import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { Token, User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { TokensResponse } from './dto/response-tokens.dto';
import * as bcrypt from 'bcrypt';
import TokenPayload from './types/token-payload';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserResponse } from '../users/dto/response-user.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user: User = await this.usersService.create(registerDto);

    const tokensResponse: TokensResponse = await this.createNewTokens(user.id);

    return {
      ...tokensResponse,
      user: new UserResponse(user),
    };
  }

  async login(loginDto: LoginDto) {
    const user: User = await this.usersService.findByEmail(loginDto.email);

    const passwordIsValid = await this.validatePassword(
      loginDto.password,
      user?.password,
    );

    if (!user || !passwordIsValid) {
      throw new BadRequestException('INVALID_CREDENTIALS');
    }

    const tokensResponse: TokensResponse = await this.createNewTokens(user.id);

    return {
      ...tokensResponse,
      user: new UserResponse(user),
    };
  }

  async createNewTokens(userId: number): Promise<TokensResponse> {
    const tokensResponse: TokensResponse = await this.generateTokens(userId);

    await this.saveRefreshToken(userId, tokensResponse.refreshToken);

    return tokensResponse;
  }

  async generateTokens(userId: number): Promise<TokensResponse> {
    const jwtPayload: TokenPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '5m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '10m',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.prisma.token.create({
      data: { refreshToken, userId },
    });
  }

  async getUserByRefreshToken(refreshToken: string): Promise<User | null> {
    const tokenData: Token = await this.prisma.token.findUnique({
      where: { refreshToken },
    });

    if (!tokenData) return null;

    return this.usersService.findById(tokenData.userId);
  }

  async validatePassword(plainTextPassword: string, hashedPassword: string) {
    if (!plainTextPassword || !hashedPassword) return false;
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
