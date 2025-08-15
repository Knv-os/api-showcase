import { Prisma } from '@prisma/client';
import { prisma } from '@databases';
import { Client, ClientFindWhere, ClientCreateBody, ClientUpdateBody } from '@/apis/clients/interfaces/clients.interface';
import { PaginationReqInterface, paginationReqHelper } from '@/helpers/pagination.helper';

export class ClientRepository {
  public async findAll(paginationParams?: PaginationReqInterface, options?: Prisma.ClientsFindManyArgs): Promise<Client[]> {
    const clients = await prisma.clients.findMany({ ...paginationReqHelper(paginationParams), ...options });

    return clients;
  }

  public async findById(clientId: string): Promise<Client> {
    const result = await prisma.clients.findUnique({ where: { id: clientId } });
    return result;
  }

  public async findOne(options: ClientFindWhere): Promise<Client | null> {
    const result = await prisma.clients.findFirst({ where: { ...options } });

    return result ? result : null;
  }

  public async create(clientData: ClientCreateBody): Promise<Client> {
    return prisma.clients.create({ data: clientData });
  }

  public async update(clientData: ClientUpdateBody, clientId: string): Promise<any> {
    return prisma.clients.update({ where: { id: clientId }, data: { ...clientData } });
  }

  public async destroy(clientId: string): Promise<Client> {
    return prisma.clients.delete({ id: clientId });
  }

  public async count(where?: Prisma.Subset<Prisma.ClientsCountArgs, Prisma.ClientsCountArgs>): Promise<number> {
    return prisma.clients.count({ ...where });
  }
}
