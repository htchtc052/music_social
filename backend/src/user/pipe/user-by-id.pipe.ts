import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UserService } from '../user.service';
import { User } from '@prisma/client';
import { UserNotFoundException } from '../exception/userNotFoundException';

@Injectable()
export class UserByIdPipe implements PipeTransform<string> {
  constructor(private readonly userService: UserService) {}

  async transform(value: string): Promise<User> {
    const userId = parseInt(value, 10); // Using parseIntPipe functionality
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UserNotFoundException(userId);
    }
    return user;
  }
}
