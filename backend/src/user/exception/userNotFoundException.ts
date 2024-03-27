import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`User with id ${id} not found`);
  }
}
