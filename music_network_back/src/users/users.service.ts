import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, User } from '@prisma/client';
import { PrismaErrors } from '../../prisma/prismaErrors';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(registerUserDto: RegisterDto): Promise<User> {
    try {
      registerUserDto.password = bcrypt.hashSync(registerUserDto.password, 10);
      const user: User = await this.prisma.user.create({
        data: registerUserDto,
      });
      return user;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === PrismaErrors.UniqueConstraintFailed
      ) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findById(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
