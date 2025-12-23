import { z } from "zod";
import { PaymentRepository } from "../../domain/payment/PaymentRepository";

const deletePaymentSchema = z.object({ id: z.string().uuid() });
export type DeletePaymentInput = z.infer<typeof deletePaymentSchema>;

export class DeletePayment {
  constructor(private repo: PaymentRepository) {}
  async execute(input: DeletePaymentInput): Promise<void> {
    const { id } = deletePaymentSchema.parse(input);
    await this.repo.delete(id);
  }
}
