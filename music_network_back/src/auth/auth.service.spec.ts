import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUsersService: UsersService = jest.createMockFromModule(
    '../users/users.service',
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
            decode: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('MOCKED_SECRET_KEY'),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.mock,
            },
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('auth routes', () => {
    const tokensResponse = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };
    const user: User = {
      username: 'John smith',
      email: 'john@smith.com',
      password: 'pwd',
    } as User;

    describe('when the register method is called', () => {
      beforeEach(async () => {
        mockUsersService.create = jest
          .fn()
          .mockImplementation((registerDto: RegisterDto) => {
            if (registerDto.email === user.email) {
              throw new BadRequestException();
            } else {
              return user;
            }
          });
        authService.createNewTokens = jest
          .fn()
          .mockResolvedValue(tokensResponse);
      });

      describe('and a free email provided', () => {
        it('should register success', async () => {
          const result = await authService.register({
            username: user.username,
            email: 'free@smith.com',
            password: user.password,
          });
          expect(result).toEqual({ ...tokensResponse, user });
        });
      });

      describe('and exists email provided', () => {
        it('should throw the BadRequestException', async () => {
          return expect(async () => {
            await authService.register({
              email: user.email,
            } as RegisterDto);
          }).rejects.toThrow(BadRequestException);
        });
      });
    });
    describe('when the login method is called', () => {
      beforeEach(async () => {
        mockUsersService.findByEmail = jest.fn().mockImplementation((email) => {
          return email === user.email ? user : undefined;
        });
        authService.validatePassword = jest
          .fn()
          .mockImplementation((password1, password2) => password1 == password2);
        authService.createNewTokens = jest
          .fn()
          .mockResolvedValue(tokensResponse);
      });
      describe('and the user can be found in the database', () => {
        describe('and a correct password is provided', () => {
          it('should login success', async () => {
            const result = await authService.login({
              email: user.email,
              password: user.password,
            });
            expect(result).toEqual({ ...tokensResponse, user });
          });
        });

        describe('and an incorrect password is provided', () => {
          it('should throw the BadRequestException', () => {
            return expect(async () => {
              await authService.login({
                email: user.email,
                password: 'wrong',
              });
            }).rejects.toThrow(BadRequestException);
          });
        });
        describe('and the user can not be found in the database', () => {
          it('should throw the BadRequestException', () => {
            return expect(async () => {
              await authService.login({
                email: 'wrong@email.com',
                password: user.password,
              });
            }).rejects.toThrow(BadRequestException);
          });
        });
      });
    });
  });
});
