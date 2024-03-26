import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserAccountController } from './user-account.controller';
import { UserPublicController } from './user-publuc.controller';

@Module({
  controllers: [UserAccountController, UserPublicController],
  providers: [UserService],
})
export class UserModule {}
