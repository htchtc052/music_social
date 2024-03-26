import { ForbiddenException } from '@nestjs/common';

export class TrackForbiddenException extends ForbiddenException {
  constructor() {
    super(`Track access denied`);
  }
}
