import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { UserResponse } from './dto/user-response.dto';
import { UserByIdPipe } from './pipe/user-by-id.pipe';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user-public')
export class UserPublicController {
  constructor(private readonly usersService: UserService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id', UserByIdPipe) user: User) {
    return new UserResponse(user);
  }
}
