import {
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { User } from '@prisma/client';

@Injectable()
export class UserByIdPipe implements PipeTransform<string> {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: string): Promise<User> {
    const userId = parseInt(value, 10); // Using parseIntPipe functionality
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(userId);
    }
    return user;
  }
}
