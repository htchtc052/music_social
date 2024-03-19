import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SerializerInterceptor } from '../serializer.interceptor';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '@prisma/client';
import { UserResponse } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @Patch()
  @UseInterceptors(SerializerInterceptor)
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  update(
    @AuthUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return this.usersService.update(+user.id, updateUserDto);
  }
  @Delete()
  @UseInterceptors(SerializerInterceptor)
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  async remove(
    @AuthUser()
    user: User,
  ): Promise<string> {
    const deletedUser: User = await this.usersService.remove(+user.id);
    return `User ${deletedUser.id} successfully deleted`;
  }
}
