import { prisma } from '@databases';
import { Prisma } from '@prisma/client';
import { Report } from "@/apis/reports/interfaces/reports.interface";

export interface Service {
  id?: string;
  idOmie?: string;
  name: string;
  pricing?: string;
  pricingPartner?: string;
  reportsIDs: Array<string>;
  reports?: Report[];
}
export interface ServiceFindWhere {
  id?: string;
  idOmie?: string;
  name?: string;
  pricing?: string;
  pricingPartner?: string;
  reports?: any;
}

export type ServiceUpdateBody = Prisma.Args<typeof prisma.services, 'update'>['data'];
export type ServiceCreateBody = Prisma.Args<typeof prisma.services, 'create'>['data'];
