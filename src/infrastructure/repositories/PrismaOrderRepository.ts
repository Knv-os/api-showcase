import { prisma } from "../prisma/client";
import { Order } from "../../domain/order/Order";
import {
  CreateOrderData,
  OrderRepository,
  UpdateOrderData,
} from "../../domain/order/OrderRepository";
import { randomUUID } from "node:crypto";

export class PrismaOrderRepository implements OrderRepository {
  async create(data: CreateOrderData): Promise<Order> {
    const created = await prisma.order.create({
      data: {
        id: randomUUID(),
        clientId: data.clientId,
        totalValue: data.totalValue,
        status: (data.status as any) ?? "DRAFT",
        trialDate: data.trialDate ?? null,
        deliveryDate: data.deliveryDate ?? null,
        items:
          data.items && data.items.length > 0
            ? {
                create: data.items.map((it) => ({
                  id: randomUUID(),
                  productId: it.productId,
                  quantity: it.quantity,
                  unitPrice: it.unitPrice,
                })),
              }
            : undefined,
      },
    });

    return new Order({
      id: created.id,
      clientId: created.clientId,
      status: created.status as any,
      totalValue: Number(created.totalValue),
      trialDate: created.trialDate,
      deliveryDate: created.deliveryDate,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  async findById(id: string): Promise<Order | null> {
    const found = await prisma.order.findUnique({ where: { id } });
    if (!found) return null;
    return new Order({
      id: found.id,
      clientId: found.clientId,
      status: found.status as any,
      totalValue: Number(found.totalValue),
      trialDate: found.trialDate,
      deliveryDate: found.deliveryDate,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
    });
  }

  async list(): Promise<Order[]> {
    const rows = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows.map(
      (r) =>
        new Order({
          id: r.id,
          clientId: r.clientId,
          status: r.status as any,
          totalValue: Number(r.totalValue),
          trialDate: r.trialDate,
          deliveryDate: r.deliveryDate,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        })
    );
  }

  async update(id: string, data: UpdateOrderData): Promise<Order> {
    const updated = await prisma.order.update({
      where: { id },
      data: {
        totalValue: data.totalValue,
        status: data.status as any,
        trialDate: data.trialDate,
        deliveryDate: data.deliveryDate,
      },
    });

    return new Order({
      id: updated.id,
      clientId: updated.clientId,
      status: updated.status as any,
      totalValue: Number(updated.totalValue),
      trialDate: updated.trialDate,
      deliveryDate: updated.deliveryDate,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.order.delete({ where: { id } });
  }
}
