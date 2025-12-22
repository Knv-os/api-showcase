import { GetOrder } from "../GetOrder";
import { CreateOrder } from "../CreateOrder";
import { Order } from "../../../domain/order/Order";
import {
  CreateOrderData,
  OrderRepository,
  UpdateOrderData,
} from "../../../domain/order/OrderRepository";
import { randomUUID } from "node:crypto";

class InMemoryOrderRepo implements OrderRepository {
  private items: Order[] = [];

  async create(data: CreateOrderData): Promise<Order> {
    const now = new Date();
    const created = new Order({
      id: randomUUID(),
      clientId: data.clientId,
      status: data.status ?? "DRAFT",
      totalValue: data.totalValue,
      trialDate: data.trialDate ?? null,
      deliveryDate: data.deliveryDate ?? null,
      createdAt: now,
      updatedAt: now,
    });
    this.items.push(created);
    return created;
  }

  async findById(id: string): Promise<Order | null> {
    return this.items.find((o) => o.id === id) ?? null;
  }

  async list(): Promise<Order[]> {
    return [...this.items];
  }

  async update(id: string, data: UpdateOrderData): Promise<Order> {
    const idx = this.items.findIndex((o) => o.id === id);
    if (idx < 0) throw new Error("not found");
    const prev = this.items[idx];
    const updated = new Order({
      id: prev.id,
      clientId: prev.clientId,
      status: data.status ?? prev.status,
      totalValue: data.totalValue ?? prev.totalValue,
      trialDate: data.trialDate ?? prev.trialDate,
      deliveryDate: data.deliveryDate ?? prev.deliveryDate,
      createdAt: prev.createdAt,
      updatedAt: new Date(),
    });
    this.items[idx] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((o) => o.id !== id);
  }
}

describe("GetOrder", () => {
  it("retorna o pedido pelo id", async () => {
    const repo = new InMemoryOrderRepo();
    const create = new CreateOrder(repo);
    const get = new GetOrder(repo);

    const created = await create.execute({
      clientId: randomUUID(),
      totalValue: 100,
    });

    const order = await get.execute({ id: created.id });
    expect(order.id).toBe(created.id);
    expect(order.totalValue).toBe(100);
  });

  it("lança erro quando id não existe", async () => {
    const repo = new InMemoryOrderRepo();
    const get = new GetOrder(repo);

    await expect(get.execute({ id: randomUUID() })).rejects.toThrow(
      "Order not found"
    );
  });
});
