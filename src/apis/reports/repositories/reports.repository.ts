import { Prisma } from '@prisma/client';
import { prisma } from '@databases';
import { Report, ReportFindWhere } from '@/apis/reports/interfaces/reports.interface';
import { PaginationReqInterface, paginationReqHelper } from '@/helpers/pagination.helper';
import { ReportCreateBody, ReportUpdateBody } from '../interfaces/reports.interface';

export class ReportRepository {
  private includesArgs = {
    include: {
      client: true,
      services: true,
      status: true,
      camera: true,
      histories: {
        include: {
          user: true,
        },
      },
    },
  };

  public async findAll(paginationParams?: PaginationReqInterface, options?: Prisma.ReportsFindManyArgs): Promise<Report[]> {
    const reports = await prisma.reports.findMany({ ...paginationReqHelper(paginationParams), ...options, ...this.includesArgs });

    return reports;
  }

  public async findById(reportId: string): Promise<Report> {
    const result = await prisma.reports.findUnique({
      where: { id: reportId },
      ...this.includesArgs,
    });
    return result;
  }

  public async findOne(options: ReportFindWhere): Promise<Report | null> {
    const result = await prisma.reports.findFirst({
      where: { ...options, servicesIDs: { hasEvery: options.servicesIDs } },
      ...this.includesArgs,
    });

    return result ? result : null;
  }

  public async create(reportData: ReportCreateBody): Promise<Report> {
    return prisma.reports.create({ data: { ...reportData } });
  }

  public async update(reportData: ReportUpdateBody, reportId: string): Promise<Report> {
    return prisma.reports.update({ where: { id: reportId }, data: { ...reportData }, ...this.includesArgs });
  }

  public async destroy(reportId: string): Promise<Report> {
    return prisma.reports.delete({ id: reportId });
  }

  public async count(where?: Prisma.Subset<Prisma.ReportsCountArgs, Prisma.ReportsCountArgs>): Promise<number> {
    return prisma.reports.count({ ...where });
  }
}
