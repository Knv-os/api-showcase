import { z } from "zod";
import { Order } from "../../domain/order/Order";
import { OrderRepository } from "../../domain/order/OrderRepository";

const orderStatus = [
  "DRAFT",
  "MEASURING",
  "CUTTING",
  "STITCHING",
  "TRIAL",
  "READY",
  "DELIVERED",
  "CANCELLED",
] as const;

const updateOrderSchema = z
  .object({
    id: z.string().uuid(),
    totalValue: z.number().nonnegative().optional(),
    status: z.enum(orderStatus).optional(),
    trialDate: z.coerce.date().nullish(),
    deliveryDate: z.coerce.date().nullish(),
  })
  .refine((data) => Object.keys(data).some((k) => k !== "id"), {
    message: "At least one field to update must be provided",
  });

export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;

export class UpdateOrder {
  constructor(private repo: OrderRepository) {}

  async execute(input: UpdateOrderInput): Promise<Order> {
    const data = updateOrderSchema.parse(input);

    const updated = await this.repo.update(data.id, {
      totalValue: data.totalValue,
      status: data.status,
      trialDate: data.trialDate ?? undefined,
      deliveryDate: data.deliveryDate ?? undefined,
    });

    return updated;
  }
}
