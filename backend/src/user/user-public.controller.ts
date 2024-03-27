import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserResponse } from './dto/user-response.dto';
import { UserByIdPipe } from './pipe/user-by-id.pipe';
import { ApiParam } from '@nestjs/swagger';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user-public')
export class UserPublicController {
  constructor() {}

  @Get(':id')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id', UserByIdPipe) user: User) {
    return new UserResponse(user);
  }
}
