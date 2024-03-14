import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(registerUserDto: RegisterUserDto) {
    registerUserDto.password = bcrypt.hashSync(registerUserDto.password, 10);

    return this.prisma.user.create({ data: registerUserDto });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
