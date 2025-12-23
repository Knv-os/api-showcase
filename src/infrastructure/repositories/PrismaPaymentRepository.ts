import { prisma } from "../prisma/client";
import { randomUUID } from "node:crypto";
import { Payment } from "../../domain/payment/Payment";
import {
  CreatePaymentData,
  PaymentRepository,
  UpdatePaymentData,
} from "../../domain/payment/PaymentRepository";

export class PrismaPaymentRepository implements PaymentRepository {
  async create(data: CreatePaymentData): Promise<Payment> {
    const created = await prisma.payment.create({
      data: {
        id: randomUUID(),
        orderId: data.orderId,
        amount: data.amount,
        status: (data.status as any) ?? "PENDING",
        method: data.method,
        installments: data.installments ?? 1,
        transactionId: data.transactionId ?? null,
      },
    });
    return new Payment({
      id: created.id,
      orderId: created.orderId,
      amount: Number(created.amount),
      status: created.status as any,
      method: created.method,
      installments: created.installments,
      transactionId: created.transactionId ?? null,
      createdAt: created.createdAt,
    });
  }

  async findById(id: string): Promise<Payment | null> {
    const found = await prisma.payment.findUnique({ where: { id } });
    return found
      ? new Payment({
          id: found.id,
          orderId: found.orderId,
          amount: Number(found.amount),
          status: found.status as any,
          method: found.method,
          installments: found.installments,
          transactionId: found.transactionId ?? null,
          createdAt: found.createdAt,
        })
      : null;
  }

  async list(): Promise<Payment[]> {
    const rows = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows.map(
      (r) =>
        new Payment({
          id: r.id,
          orderId: r.orderId,
          amount: Number(r.amount),
          status: r.status as any,
          method: r.method,
          installments: r.installments,
          transactionId: r.transactionId ?? null,
          createdAt: r.createdAt,
        })
    );
  }

  async update(id: string, data: UpdatePaymentData): Promise<Payment> {
    const updated = await prisma.payment.update({
      where: { id },
      data: {
        amount: data.amount ?? undefined,
        status: (data.status as any) ?? undefined,
        method: data.method ?? undefined,
        installments: data.installments ?? undefined,
        transactionId: data.transactionId ?? undefined,
      },
    });
    return new Payment({
      id: updated.id,
      orderId: updated.orderId,
      amount: Number(updated.amount),
      status: updated.status as any,
      method: updated.method,
      installments: updated.installments,
      transactionId: updated.transactionId ?? null,
      createdAt: updated.createdAt,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.payment.delete({ where: { id } });
  }
}
