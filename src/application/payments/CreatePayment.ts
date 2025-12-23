import { z } from "zod";
import { Payment } from "../../domain/payment/Payment";
import { PaymentRepository } from "../../domain/payment/PaymentRepository";

const paymentStatus = ["PENDING", "PARTIAL", "PAID", "REFUNDED"] as const;

const createPaymentSchema = z.object({
  orderId: z.string().uuid(),
  amount: z.number().nonnegative(),
  status: z.enum(paymentStatus).optional(),
  method: z.string().min(1),
  installments: z.number().int().positive().optional(),
  transactionId: z.string().trim().nullish(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

export class CreatePayment {
  constructor(private repo: PaymentRepository) {}
  async execute(input: CreatePaymentInput): Promise<Payment> {
    const data = createPaymentSchema.parse(input);
    return this.repo.create({
      orderId: data.orderId,
      amount: data.amount,
      status: data.status ?? "PENDING",
      method: data.method,
      installments: data.installments ?? 1,
      transactionId: data.transactionId ?? null,
    });
  }
}
