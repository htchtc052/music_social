import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

@Module({
  imports: [UsersModule],
  providers: [UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
