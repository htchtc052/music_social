import { UsersService } from './users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../auth/dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './dto/response-user.dto';

describe('UsersService', () => {
  let usersService: UsersService;

  const prisma = {
    user: {
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('users routes', () => {
    const user: User = {
      username: 'John smith',
      email: 'john@smith.com',
      password: 'pwd',
    } as User;
    it('when the create user method is called', async () => {
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation((pass, salt, cb) => cb(null, ''));

      jest.spyOn(prisma.user, 'create').mockResolvedValue(user);

      const createdUser: User = await usersService.create({
        username: user.username,
        email: 'free@email.com',
        password: user.password,
      } as RegisterDto);

      expect(createdUser).toEqual(user);
    });

    it('when the update user method is called', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'New user name',
      } as UpdateUserDto;

      const editedUserMock: User = {
        ...user,
        ...updateUserDto,
      } as User;

      jest.spyOn(prisma.user, 'update').mockResolvedValue(editedUserMock);

      const editedUserResponse: UserResponse = await usersService.update(
        user.id,
        updateUserDto,
      );

      expect(editedUserResponse).toEqual(new UserResponse(editedUserMock));
    });

    it('when the remove user method is called', async () => {
      const deletedUserMock: User = { ...user, isDeleted: true } as User;

      jest.spyOn(prisma.user, 'update').mockResolvedValue(deletedUserMock);

      const editedUserResponse: UserResponse = await usersService.remove(
        user.id,
      );

      expect(editedUserResponse).toEqual(new UserResponse(deletedUserMock));
    });
  });
});
