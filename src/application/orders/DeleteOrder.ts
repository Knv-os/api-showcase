import { z } from "zod";
import { OrderRepository } from "../../domain/order/OrderRepository";

const deleteOrderSchema = z.object({ id: z.string().uuid() });

export type DeleteOrderInput = z.infer<typeof deleteOrderSchema>;

export class DeleteOrder {
  constructor(private repo: OrderRepository) {}

  async execute(input: DeleteOrderInput): Promise<void> {
    const { id } = deleteOrderSchema.parse(input);
    const existing = await this.repo.findById(id);
    if (!existing) throw new Error("Order not found");
    await this.repo.delete(id);
  }
}
