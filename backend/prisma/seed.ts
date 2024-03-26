import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const seed = async (): Promise<void> => {
  const password = '1230';
  const hashedPassword = bcrypt.hashSync(password, 10);

  const user1: User = await prisma.user.upsert({
    where: {
      email_isDeleted: { email: 'test1@example.com', isDeleted: false },
    },
    update: {},
    create: {
      email: 'test1@example.com',
      username: 'test1user',
      firstName: 'Test1',
      lastName: 'User1',
      password: hashedPassword,
    },
  });
  const user2: User = await prisma.user.upsert({
    where: {
      email_isDeleted: { email: 'test2@example.com', isDeleted: false },
    },
    update: {},
    create: {
      email: 'test2@example.com',
      username: 'test2user',
      firstName: 'Test2',
      lastName: 'User2',
      password: hashedPassword,
    },
  });
};

seed();
