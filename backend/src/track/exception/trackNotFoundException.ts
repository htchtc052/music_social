import { NotFoundException } from '@nestjs/common';

export class TrackNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Track with id ${id} not found`);
  }
}
