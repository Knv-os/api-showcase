import { PrismaClient, Prisma } from '@prisma/client';

export const softDelete = Prisma.defineExtension({
  name: 'softDelete',
  model: {
    $allModels: {
      async delete<M, A>(this: M, where: Prisma.Args<M, 'delete'>['where']): Promise<Prisma.Result<M, A, 'update'>> {
        const context = Prisma.getExtensionContext(this);

        return (context as any).update({
          where,
          data: {
            deletedAt: new Date(),
            deleted: true,
          },
        });
      },
    },
  },
});

export const prismaWithSequenceId = Prisma.defineExtension(prisma =>
  prisma.$extends({
    query: {
      reports: {
        async create({ args, query }) {
          const lastDoc = await prisma.reports.findFirst({
            orderBy: { number: 'desc' },
          });

          const nextId = lastDoc ? lastDoc.number + 1 : 1;
          args.data.number = `${nextId}`;

          return query(args);
        },
      },
    },
  }),
);

export const softDeleteMany = Prisma.defineExtension({
  name: 'softDeleteMany',
  model: {
    $allModels: {
      async deleteMany<M, A>(this: M, where: Prisma.Args<M, 'deleteMany'>['where']): Promise<Prisma.Result<M, A, 'updateMany'>> {
        const context = Prisma.getExtensionContext(this);

        return (context as any).updateMany({
          where,
          data: {
            deletedAt: new Date(),
            deleted: true,
          },
        });
      },
    },
  },
});

export const filterSoftDeleted = Prisma.defineExtension({
  name: 'filterSoftDeleted',
  query: {
    $allModels: {
      async $allOperations({ operation, args, query }) {
        if (operation === 'findUnique' || operation === 'findFirst' || operation === 'findMany' || operation === 'count') {
          args.where = { ...args.where, deleted: false };
          return query(args);
        }
        return query(args);
      },
    },
  },
  result: {
    $allModels: {
      deleted: {
        compute() {
          return undefined;
        },
      },
      deletedAt: {
        compute() {
          return undefined;
        },
      },
    },
  },
});

const prisma = new PrismaClient().$extends(softDelete).$extends(softDeleteMany).$extends(filterSoftDeleted).$extends(prismaWithSequenceId);

export { prisma };
