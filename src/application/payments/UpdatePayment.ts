import { z } from "zod";
import { Payment } from "../../domain/payment/Payment";
import { PaymentRepository } from "../../domain/payment/PaymentRepository";

const paymentStatus = ["PENDING", "PARTIAL", "PAID", "REFUNDED"] as const;

const updatePaymentSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().nonnegative().optional(),
  status: z.enum(paymentStatus).optional(),
  method: z.string().min(1).optional(),
  installments: z.number().int().positive().optional(),
  transactionId: z.string().trim().nullish(),
});

export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;

export class UpdatePayment {
  constructor(private repo: PaymentRepository) {}
  async execute(input: UpdatePaymentInput): Promise<Payment> {
    const data = updatePaymentSchema.parse(input);
    return this.repo.update(data.id, {
      amount: data.amount,
      status: data.status,
      method: data.method,
      installments: data.installments,
      transactionId: data.transactionId ?? undefined,
    });
  }
}
