import { prisma } from '@databases';
import { Prisma } from '@prisma/client';

export interface Camera {
  id?: string;
  idOrderOmie?: string;
  model?: string;
  brand?: string;
  invoice?: string;
  warrantyFinishDate?: Date;
  serialNumber: string;
  replaced?: boolean;
}

export interface CameraFindWhere {
  id?: string;
  idOrderOmie?: string;
  model?: string;
  brand?: string;
  invoice?: string;
  serialNumber?: string;
  warrantyFinishDate?: Date;
  replaced?: boolean;
}

export type CameraUpdateBody = Prisma.Args<typeof prisma.cameras, 'update'>['data'];
export type CameraCreateBody = Prisma.Args<typeof prisma.cameras, 'create'>['data'];
