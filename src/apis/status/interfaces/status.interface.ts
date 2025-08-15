import { prisma } from '@databases';
import { Prisma } from '@prisma/client';

export interface Status {
  id?: string;
  name: string;
  backgroundColor: string;
  textColor: string;
}

export interface StatusFindWhere {
  id?: string;
  name?: string;
  backgroundColor?: string;
  textColor?: string;
}

export type StatusUpdateBody = Prisma.Args<typeof prisma.status, 'update'>['data'];
export type StatusCreateBody = Prisma.Args<typeof prisma.status, 'create'>['data'];
