import { Payment } from "./Payment";

export interface CreatePaymentData {
  orderId: string;
  amount: number;
  status?: string; // PENDING | PARTIAL | PAID | REFUNDED
  method: string;
  installments?: number;
  transactionId?: string | null;
}

export interface UpdatePaymentData {
  amount?: number;
  status?: string; // PENDING | PARTIAL | PAID | REFUNDED
  method?: string;
  installments?: number;
  transactionId?: string | null;
}

export interface PaymentRepository {
  create(data: CreatePaymentData): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  list(): Promise<Payment[]>;
  update(id: string, data: UpdatePaymentData): Promise<Payment>;
  delete(id: string): Promise<void>;
}
