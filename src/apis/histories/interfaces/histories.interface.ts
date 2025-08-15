import { Report } from '@/apis/reports/interfaces/reports.interface';
import { User } from '@/apis/users/interfaces/users.interface';
import { prisma } from '@databases';
import { Prisma } from '@prisma/client';

export interface History {
  id?: string;
  changeString: string;
  userId: string;
  user?: User;
  reportId: string;
  report?: Report;
}

export interface HistoryFindWhere {
  id?: string;
  changeString?: string;
  userId?: string;
  reportId?: string;
}

export type HistoryUpdateBody = Prisma.Args<typeof prisma.histories, 'update'>['data'];
export type HistoryCreateBody = Prisma.Args<typeof prisma.histories, 'create'>['data'];
export type HistoriesCreateBody = Prisma.Args<typeof prisma.histories, 'createMany'>['data'];
