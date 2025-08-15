import { Prisma } from '@prisma/client';
import { prisma } from '@databases';
import { PaginationReqInterface, paginationReqHelper } from '@/helpers/pagination.helper';
import { Service, ServiceFindWhere, ServiceCreateBody, ServiceUpdateBody } from '../interfaces/services.interface';

export class ServiceRepository {
  public async findAll(paginationParams?: PaginationReqInterface, options?: Prisma.ServicesFindManyArgs): Promise<Service[]> {
    const services = await prisma.services.findMany({ ...paginationReqHelper(paginationParams), ...options });

    return services;
  }

  public async findById(serviceId: string): Promise<Service> {
    const result = await prisma.services.findUnique({ where: { id: serviceId } });
    return result;
  }

  public async findOne(options: ServiceFindWhere): Promise<Service | null> {
    const result = await prisma.services.findFirst({ where: { ...options } });

    return result ? result : null;
  }

  public async create(serviceData: ServiceCreateBody): Promise<Service> {
    return prisma.services.create({ data: serviceData });
  }

  public async update(serviceData: ServiceUpdateBody, serviceId: string): Promise<any> {
    return prisma.services.update({ where: { id: serviceId }, data: { ...serviceData } });
  }

  public async destroy(serviceId: string): Promise<Service> {
    return prisma.services.delete({ id: serviceId });
  }

  public async count(where?: Prisma.Subset<Prisma.ServicesCountArgs, Prisma.ServicesCountArgs>): Promise<number> {
    return prisma.services.count({ ...where });
  }
}
