import { Prisma } from '@prisma/client';
import { prisma } from '@databases';
import {
  History,
  HistoryFindWhere,
  HistoryCreateBody,
  HistoryUpdateBody,
  HistoriesCreateBody,
} from '@/apis/histories/interfaces/histories.interface';
import { PaginationReqInterface, paginationReqHelper } from '@/helpers/pagination.helper';

export class HistoryRepository {
  private includesArgs = {
    include: {
      user: true,
    },
  };

  public async findAll(paginationParams?: PaginationReqInterface, options?: Prisma.HistoriesFindManyArgs): Promise<History[]> {
    const histories = await prisma.histories.findMany({ ...paginationReqHelper(paginationParams), ...options, ...this.includesArgs });

    return histories;
  }

  public async findById(historyId: string): Promise<History> {
    const result = await prisma.histories.findUnique({ where: { id: historyId }, ...this.includesArgs });

    return result;
  }

  public async findOne(options: HistoryFindWhere): Promise<History | null> {
    const result = await prisma.histories.findFirst({ where: { ...options }, ...this.includesArgs });

    return result ? result : null;
  }

  public async create(historyData: HistoryCreateBody): Promise<History> {
    return prisma.histories.create({ data: historyData, ...this.includesArgs });
  }

  public async createMany(historyData: HistoriesCreateBody): Promise<any> {
    return prisma.histories.createMany({ data: historyData });
  }

  public async update(historyData: HistoryUpdateBody, historyId: string): Promise<any> {
    return prisma.histories.update({ where: { id: historyId }, data: { ...historyData } });
  }

  public async destroy(historyId: string): Promise<History> {
    return prisma.histories.delete({ id: historyId });
  }

  public async count(where?: Prisma.Subset<Prisma.HistoriesCountArgs, Prisma.HistoriesCountArgs>): Promise<number> {
    return prisma.histories.count({ ...where });
  }
}
