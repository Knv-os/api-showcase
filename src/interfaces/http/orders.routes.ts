import { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaOrderRepository } from "../../infrastructure/repositories/PrismaOrderRepository";
import { CreateOrder } from "../../application/orders/CreateOrder";
import { GetOrder } from "../../application/orders/GetOrder";
import { ListOrders } from "../../application/orders/ListOrders";
import { UpdateOrder } from "../../application/orders/UpdateOrder";
import { DeleteOrder } from "../../application/orders/DeleteOrder";
import { prisma } from "../../infrastructure/prisma/client";

export async function ordersRoutes(app: FastifyInstance) {
  const repo = new PrismaOrderRepository();
  const createOrder = new CreateOrder(repo);
  const getOrder = new GetOrder(repo);
  const listOrders = new ListOrders(repo);
  const updateOrder = new UpdateOrder(repo);
  const deleteOrder = new DeleteOrder(repo);

  const orderStatus = [
    "DRAFT",
    "MEASURING",
    "CUTTING",
    "STITCHING",
    "TRIAL",
    "READY",
    "DELIVERED",
    "CANCELLED",
  ] as const;

  app.post("/orders", async (request, reply) => {
    const bodySchema = z.object({
      clientId: z.string().uuid(),
      totalValue: z.number().nonnegative(),
      status: z.enum(orderStatus).optional(),
      trialDate: z.coerce.date().nullish(),
      deliveryDate: z.coerce.date().nullish(),
      items: z
        .array(
          z.object({
            productId: z.string().uuid(),
            quantity: z.number().int().positive(),
            unitPrice: z.number().nonnegative(),
          })
        )
        .optional(),
    });

    const body = bodySchema.parse(request.body);
    const order = await createOrder.execute(body);
    const expanded = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        payments: true,
        items: { include: { product: true } },
        client: true,
      },
    });
    return reply.code(201).send(expanded);
  });

  app.get("/orders", async (_request, reply) => {
    await listOrders.execute();
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        payments: true,
        items: { include: { product: true } },
        client: true,
      },
    });
    return reply.send(orders);
  });

  app.get("/orders/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);
    await getOrder.execute({ id });
    const expanded = await prisma.order.findUnique({
      where: { id },
      include: {
        payments: true,
        items: { include: { product: true } },
        client: true,
      },
    });
    return reply.send(expanded);
  });

  app.put("/orders/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const bodySchema = z.object({
      totalValue: z.number().nonnegative().optional(),
      status: z.enum(orderStatus).optional(),
      trialDate: z.coerce.date().nullish(),
      deliveryDate: z.coerce.date().nullish(),
    });

    const { id } = paramsSchema.parse(request.params);
    const body = bodySchema.parse(request.body);

    const order = await updateOrder.execute({ id, ...body });
    const expanded = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        payments: true,
        items: { include: { product: true } },
        client: true,
      },
    });
    return reply.send(expanded);
  });

  app.delete("/orders/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);
    await deleteOrder.execute({ id });
    return reply.code(204).send();
  });
}
