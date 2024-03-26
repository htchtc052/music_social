import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { UserResponse } from './dto/user-response.dto';
import { UserByIdPipe } from './pipe/user-by-id.pipe';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id', UserByIdPipe) user: User) {
    return new UserResponse(user);
  }
}
