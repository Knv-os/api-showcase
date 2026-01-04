import { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaPaymentRepository } from "../../infrastructure/repositories/PrismaPaymentRepository";
import { CreatePayment } from "../../application/payments/CreatePayment";
import { GetPayment } from "../../application/payments/GetPayment";
import { ListPayments } from "../../application/payments/ListPayments";
import { UpdatePayment } from "../../application/payments/UpdatePayment";
import { prisma } from "../../infrastructure/prisma/client";
import { DeletePayment } from "../../application/payments/DeletePayment";
import { getPaginationParams, buildPaginated } from "../../shared/pagination";

export async function paymentsRoutes(app: FastifyInstance) {
  const repo = new PrismaPaymentRepository();
  const createPayment = new CreatePayment(repo);
  const getPayment = new GetPayment(repo);
  const listPayments = new ListPayments(repo);
  const updatePayment = new UpdatePayment(repo);
  const deletePayment = new DeletePayment(repo);

  const paymentStatus = ["PENDING", "PARTIAL", "PAID", "REFUNDED"] as const;

  app.post("/payments", async (request, reply) => {
    const bodySchema = z.object({
      orderId: z.string().uuid(),
      amount: z.number().nonnegative(),
      status: z.enum(paymentStatus).optional(),
      method: z.string().min(1),
      installments: z.number().int().positive().optional(),
      transactionId: z.string().trim().nullish(),
    });
    const body = bodySchema.parse(request.body);
    const created = await createPayment.execute(body);
    const expanded = await prisma.payment.findUnique({
      where: { id: created.id },
      include: { order: { include: { client: true } } },
    });
    return reply.code(201).send(expanded);
  });

  app.get("/payments", async (_request, reply) => {
    const { page, perPage } = getPaginationParams((_request as any).query);
    const querySchema = z.object({
      q: z.string().trim().min(1).optional(),
      status: z.enum(["PENDING", "PARTIAL", "PAID", "REFUNDED"]).optional(),
      sortBy: z
        .enum(["createdAt", "amount", "status"])
        .default("createdAt")
        .optional(),
      sortOrder: z.enum(["asc", "desc"]).default("desc").optional(),
    });
    const {
      q,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = querySchema.parse((_request as any).query ?? {});

    await listPayments.execute();
    const where = {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { method: { contains: q, mode: "insensitive" as const } },
              { transactionId: { contains: q, mode: "insensitive" as const } },
              {
                order: {
                  client: {
                    name: { contains: q, mode: "insensitive" as const },
                  },
                },
              },
            ],
          }
        : {}),
    } as any;

    const [total, rows] = await Promise.all([
      prisma.payment.count({ where }),
      prisma.payment.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        include: { order: { include: { client: true } } },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
    ]);
    return reply.send(buildPaginated(rows, page, perPage, total));
  });

  app.get("/payments/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);
    await getPayment.execute({ id });
    const expanded = await prisma.payment.findUnique({
      where: { id },
      include: { order: { include: { client: true } } },
    });
    return reply.send(expanded);
  });

  app.put("/payments/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const bodySchema = z.object({
      amount: z.number().nonnegative().optional(),
      status: z.enum(paymentStatus).optional(),
      method: z.string().min(1).optional(),
      installments: z.number().int().positive().optional(),
      transactionId: z.string().trim().nullish(),
    });
    const { id } = paramsSchema.parse(request.params);
    const body = bodySchema.parse(request.body);
    const updated = await updatePayment.execute({ id, ...body });
    const expanded = await prisma.payment.findUnique({
      where: { id: updated.id },
      include: { order: { include: { client: true } } },
    });
    return reply.send(expanded);
  });

  app.delete("/payments/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);
    await deletePayment.execute({ id });
    return reply.code(204).send();
  });
}
