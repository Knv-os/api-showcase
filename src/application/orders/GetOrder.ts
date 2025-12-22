import { z } from "zod";
import { Order } from "../../domain/order/Order";
import { OrderRepository } from "../../domain/order/OrderRepository";

const getOrderSchema = z.object({ id: z.string().uuid() });

export type GetOrderInput = z.infer<typeof getOrderSchema>;

export class GetOrder {
  constructor(private repo: OrderRepository) {}

  async execute(input: GetOrderInput): Promise<Order> {
    const { id } = getOrderSchema.parse(input);
    const order = await this.repo.findById(id);
    if (!order) throw new Error("Order not found");
    return order;
  }
}
