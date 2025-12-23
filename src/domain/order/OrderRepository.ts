import { Order } from "./Order";

export interface CreateOrderData {
  clientId: string;
  totalValue: number;
  status?: string;
  trialDate?: Date | null;
  deliveryDate?: Date | null;
  items?: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
}

export interface UpdateOrderData {
  totalValue?: number;
  status?: string;
  trialDate?: Date | null;
  deliveryDate?: Date | null;
}

export interface OrderRepository {
  create(data: CreateOrderData): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  list(): Promise<Order[]>;
  update(id: string, data: UpdateOrderData): Promise<Order>;
  delete(id: string): Promise<void>;
}
