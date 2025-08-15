import { prisma } from '@databases';
import { Prisma } from '@prisma/client';
import { Client } from '@/apis/clients/interfaces/clients.interface';
import { Service } from '@/apis/services/interfaces/services.interface';
import { Status } from '@/apis/status/interfaces/status.interface';
import { Camera } from '@/apis/cameras/interfaces/cameras.interface';

export interface Report {
  id?: string;
  number?: string;
  descriptionClient: string;
  descriptionTech?: string;
  pending: boolean;
  denied: boolean;
  clientId: string;
  client?: Client;
  statusId: string;
  status?: Status;
  cameraId?: string;
  camera?: Camera;
  servicesIDs: Array<string>;
  services?: Service[];
}

export interface ReportFindWhere {
  id?: string;
  number?: string;
  descriptionClient?: string;
  descriptionTech?: string;
  pending?: boolean;
  denied?: boolean;
  clientId?: string;
  statusId?: string;
  cameraId?: string;
  servicesIDs?: Array<string>;
}

export interface PublicReport {
  client: Partial<Client>;
  reports: Partial<Report>[];
}

export type ReportUpdateBody = Prisma.Args<typeof prisma.reports, 'update'>['data'];
export type ReportCreateBody = Prisma.Args<typeof prisma.reports, 'create'>['data'];
