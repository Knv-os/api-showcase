import { Prisma } from '@prisma/client';
import { prisma } from '@databases';
import { Status, StatusFindWhere, StatusCreateBody, StatusUpdateBody } from '@/apis/status/interfaces/status.interface';
import { PaginationReqInterface, paginationReqHelper } from '@/helpers/pagination.helper';

export class StatusRepository {
  public async findAll(paginationParams?: PaginationReqInterface, options?: Prisma.StatusFindManyArgs): Promise<Status[]> {
    const status = await prisma.status.findMany({ ...paginationReqHelper(paginationParams), ...options });

    return status;
  }

  public async findById(statusId: string): Promise<Status> {
    const result = await prisma.status.findUnique({ where: { id: statusId } });
    return result;
  }

  public async findOne(options: StatusFindWhere): Promise<Status | null> {
    const result = await prisma.status.findFirst({ where: { ...options } });

    return result ? result : null;
  }

  public async create(statusData: StatusCreateBody): Promise<Status> {
    return prisma.status.create({ data: statusData });
  }

  public async update(statusData: StatusUpdateBody, statusId: string): Promise<any> {
    return prisma.status.update({ where: { id: statusId }, data: statusData });
  }

  public async destroy(statusId: string): Promise<Status> {
    return prisma.status.delete({ id: statusId });
  }

  public async count(where?: Prisma.Subset<Prisma.StatusCountArgs, Prisma.StatusCountArgs>): Promise<number> {
    return prisma.status.count({ ...where });
  }
}
