import { Prisma } from '@prisma/client';
import { prisma } from '@databases';
import { PaginationReqInterface, paginationReqHelper } from '@/helpers/pagination.helper';
import { Order, OrderFindWhere, OrderCreateBody, OrderUpdateBody } from '../interfaces/orders.interface';

export class OrderRepository {
  private includesArgs = {
    include: {
      billing: {
        include: {
          client: true,
        },
      },
      reports: {
        include: {
          client: true,
          status: true,
        },
      },
    },
  };

  public async findAll(paginationParams?: PaginationReqInterface, options?: Prisma.OrdersFindManyArgs): Promise<Order[]> {
    const orders = await prisma.orders.findMany({ ...paginationReqHelper(paginationParams), ...options, ...this.includesArgs });

    return orders;
  }

  public async findById(orderId: string): Promise<Order> {
    const result = await prisma.orders.findUnique({ where: { id: orderId }, ...this.includesArgs });
    return result;
  }

  public async findOne(options: OrderFindWhere): Promise<Order | null> {
    const result = await prisma.orders.findFirst({ where: { ...options }, ...this.includesArgs });

    return result ? result : null;
  }

  public async create(orderData: OrderCreateBody): Promise<Order> {
    return prisma.orders.create({ data: orderData, ...this.includesArgs });
  }

  public async update(orderData: OrderUpdateBody, orderId: string): Promise<any> {
    return prisma.orders.update({ where: { id: orderId }, data: { ...orderData }, ...this.includesArgs });
  }

  public async destroy(orderId: string): Promise<Order> {
    return prisma.orders.delete({ id: orderId });
  }

  public async count(where?: Prisma.Subset<Prisma.OrdersCountArgs, Prisma.OrdersCountArgs>): Promise<number> {
    return prisma.orders.count({ ...where });
  }
}
