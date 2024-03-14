import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [AuthService],
})
export class UsersModule {}
