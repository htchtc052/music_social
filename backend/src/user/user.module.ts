import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserAuthController } from './user-auth.controller';
import { UserPublicController } from './user-public.controller';

@Module({
  controllers: [UserAuthController, UserPublicController],
  providers: [UserService],
})
export class UserModule {}
