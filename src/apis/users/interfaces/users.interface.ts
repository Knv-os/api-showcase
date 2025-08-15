import { prisma } from '@databases';
import { Prisma } from '@prisma/client';

export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
}

export interface UserFindWhere {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
}

export type UserUpdateBody = Prisma.Args<typeof prisma.users, 'update'>['data'];
export type UserCreateBody = Prisma.Args<typeof prisma.users, 'create'>['data'];
