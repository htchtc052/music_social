import { NotFoundException } from '@nestjs/common';

export class TrackNotFoundException extends NotFoundException {
  constructor(trackId: number) {
    super(`Track with id ${trackId} not found`);
  }
}
