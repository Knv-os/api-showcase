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

const createOrderSchema = z.object({
  clientId: z.string().uuid(),
  totalValue: z.number().nonnegative(),
  status: z.enum(orderStatus).optional(),
  trialDate: z.coerce.date().nullish(),
  deliveryDate: z.coerce.date().nullish(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export class CreateOrder {
  constructor(private repo: OrderRepository) {}

  async execute(input: CreateOrderInput): Promise<Order> {
    const data = createOrderSchema.parse(input);

    const order = await this.repo.create({
      clientId: data.clientId,
      totalValue: data.totalValue,
      status: data.status ?? "DRAFT",
      trialDate: data.trialDate ?? null,
      deliveryDate: data.deliveryDate ?? null,
    });

    return order;
  }
}
