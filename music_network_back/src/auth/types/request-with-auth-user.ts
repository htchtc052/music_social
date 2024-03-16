import { Request } from 'express';
import { User } from '@prisma/client';

export type RequestWithAuthUser = Request & {
  user: User;
};
