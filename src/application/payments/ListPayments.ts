import { Payment } from "../../domain/payment/Payment";
import { PaymentRepository } from "../../domain/payment/PaymentRepository";

export class ListPayments {
  constructor(private repo: PaymentRepository) {}
  async execute(): Promise<Payment[]> {
    return this.repo.list();
  }
}
