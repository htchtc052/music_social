import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, User } from '@prisma/client';
import { PrismaErrors } from '../../prisma/prismaErrors';
import { UserResponse } from './dto/user-response.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
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
        throw new BadRequestException('EMAIL_EXISTS');
      }
      throw new BadRequestException();
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findById(id: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id, isDeleted: false },
    });
  }

  findByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email_isDeleted: { email, isDeleted: false },
      },
    });
  }

  async update(user: User, updateUserDto: UpdateUserDto) {
    const updatedUser: User = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: updateUserDto,
    });

    return new UserResponse(updatedUser);
  }

  async remove(user: User) {
    const removedUser: User = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: { isDeleted: true, email: user.email + uuidv4() },
    });
    return removedUser;
  }
}
