import { Prisma } from '@prisma/client';
import { prisma } from '@databases';
import { Billing, BillingFindWhere, BillingCreateBody, BillingUpdateBody } from '@/apis/billings/interfaces/billings.interface';
import { PaginationReqInterface, paginationReqHelper } from '@/helpers/pagination.helper';

export class BillingRepository {
  private includesArgs = {
    include: {
      client: true,
    },
  };

  public async findAll(paginationParams?: PaginationReqInterface, options?: Prisma.BillingsFindManyArgs): Promise<Billing[]> {
    const billings = await prisma.billings.findMany({ ...paginationReqHelper(paginationParams), ...options, ...this.includesArgs });

    return billings;
  }

  public async findById(billingId: string): Promise<Billing> {
    const result = await prisma.billings.findUnique({ where: { id: billingId }, ...this.includesArgs });
    return result;
  }

  public async findOne(options: BillingFindWhere): Promise<Billing | null> {
    const result = await prisma.billings.findFirst({ where: { ...options }, ...this.includesArgs });

    return result ? result : null;
  }

  public async create(billingData: BillingCreateBody): Promise<Billing> {
    return prisma.billings.create({ data: billingData, ...this.includesArgs });
  }

  public async update(billingData: BillingUpdateBody, billingId: string): Promise<any> {
    return prisma.billings.update({ where: { id: billingId }, data: { ...billingData }, ...this.includesArgs });
  }

  public async destroy(billingId: string): Promise<Billing> {
    return prisma.billings.delete({ id: billingId });
  }

  public async count(where?: Prisma.Subset<Prisma.BillingsCountArgs, Prisma.BillingsCountArgs>): Promise<number> {
    return prisma.billings.count({ ...where });
  }
}
