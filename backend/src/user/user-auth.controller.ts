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
export class UserAuthController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAuthUser(@AuthUser() authUser: User): Promise<UserResponse> {
    return new UserResponse(authUser);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  update(
    @AuthUser() authUser: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return this.userService.update(authUser, updateUserDto);
  }
  @Delete()
  @HttpCode(HttpStatus.OK)
  async remove(
    @AuthUser()
    authUser: User,
  ): Promise<string> {
    console.debug(authUser);
    const deletedUser: User = await this.userService.remove(authUser);
    return `User ${deletedUser.id} successfully deleted`;
  }
}
