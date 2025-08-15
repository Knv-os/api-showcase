import { prisma } from '@databases';
import { Prisma } from '@prisma/client';

export interface Client {
  id?: string;
  name: string;
  document: string;
  company?: string;
  email: string;
  phone: string;
  description: string;
  partner: boolean;
}

export interface ClientFindWhere {
  id?: string;
  name?: string;
  document?: string;
  company?: string;
  email?: string;
  phone?: string;
  description?: string;
  partner?: boolean;
}

export type ClientUpdateBody = Prisma.Args<typeof prisma.clients, 'update'>['data'];
export type ClientCreateBody = Prisma.Args<typeof prisma.clients, 'create'>['data'];
