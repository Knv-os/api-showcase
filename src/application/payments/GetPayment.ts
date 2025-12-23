import { z } from "zod";
import { Payment } from "../../domain/payment/Payment";
import { PaymentRepository } from "../../domain/payment/PaymentRepository";

const getPaymentSchema = z.object({ id: z.string().uuid() });
export type GetPaymentInput = z.infer<typeof getPaymentSchema>;

export class GetPayment {
  constructor(private repo: PaymentRepository) {}
  async execute(input: GetPaymentInput): Promise<Payment> {
    const { id } = getPaymentSchema.parse(input);
    const found = await this.repo.findById(id);
    if (!found) throw new Error("Payment not found");
    return found;
  }
}
