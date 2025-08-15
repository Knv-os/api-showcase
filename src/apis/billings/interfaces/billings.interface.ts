import { prisma } from '@databases';
import { Prisma } from '@prisma/client';

export interface Billing {
  id?: string;
  companyName: string;
  document: string;
  fantasyName: string;
  phone: string;
  street: string;
  neighborhood: string;
  number: string;
  unit: string;
  state: string;
  city: string;
  zipCode: string;
}

export interface BillingFindWhere {
  id?: string;
  companyName?: string;
  document?: string;
  fantasyName?: string;
  phone?: string;
  street?: string;
  neighborhood?: string;
  number?: string;
  unit?: string;
  state?: string;
  city?: string;
  zipCode?: string;
}

export type BillingUpdateBody = Prisma.Args<typeof prisma.billings, 'update'>['data'];
export type BillingCreateBody = Prisma.Args<typeof prisma.billings, 'create'>['data'];
