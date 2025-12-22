import { Order } from "../../domain/order/Order";
import { OrderRepository } from "../../domain/order/OrderRepository";

export class ListOrders {
  constructor(private repo: OrderRepository) {}

  async execute(): Promise<Order[]> {
    return this.repo.list();
  }
}
