import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '@prisma/client';
import { UserResponse } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@Controller('user-account')
export class UserAccountController {
  constructor(private readonly usersService: UserService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getUser(@AuthUser() authUser: User): Promise<UserResponse> {
    return new UserResponse(authUser);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  update(
    @AuthUser() authUser: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return this.usersService.update(+authUser.id, updateUserDto);
  }
  @Delete()
  @HttpCode(HttpStatus.OK)
  async remove(
    @AuthUser()
    authUser: User,
  ): Promise<string> {
    console.debug(authUser);
    const deletedUser: User = await this.usersService.remove(+authUser.id);
    return `User ${deletedUser.id} successfully deleted`;
  }
}
