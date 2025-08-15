import { prisma } from '@databases';
import { Prisma } from '@prisma/client';
import { Report } from "@/apis/reports/interfaces/reports.interface";
import { Billing } from '@/apis/billings/interfaces/billings.interface';

export interface Order {
  id?: string;
  idOmie?: string;
  evaluationFee: boolean;
  billingId: string;
  shipping?: string;
  reportsIDs: Array<string>;
  billing?: Billing;
  reports?: Report[];
}

export interface OrderFindWhere {
  id?: string;
  idOmie?: string;
  evaluationFee?: boolean;
  billingId?: string;
  reports?: any;
}

export type OrderUpdateBody = Prisma.Args<typeof prisma.orders, 'update'>['data'];
export type OrderCreateBody = Prisma.Args<typeof prisma.orders, 'create'>['data'];
