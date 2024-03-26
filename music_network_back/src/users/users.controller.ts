import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '@prisma/client';
import { UserResponse } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SerializerInterceptor } from '../serializer.interceptor';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/getAuthUser')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @UseInterceptors(SerializerInterceptor)
  async getUser(@AuthUser() user: User): Promise<UserResponse> {
    return new UserResponse(user);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  update(
    @AuthUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return this.usersService.update(+user.id, updateUserDto);
  }
  @Delete()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async remove(
    @AuthUser()
    user: User,
  ): Promise<string> {
    const deletedUser: User = await this.usersService.remove(+user.id);
    return `User ${deletedUser.id} successfully deleted`;
  }
}
