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

describe("CreateOrder", () => {
  it("cria pedido com status default DRAFT", async () => {
    const repo = new InMemoryOrderRepo();
    const usecase = new CreateOrder(repo);

    const order = await usecase.execute({
      clientId: randomUUID(),
      totalValue: 199.9,
    });

    expect(order).toBeInstanceOf(Order);
    expect(order.status).toBe("DRAFT");
    expect(order.totalValue).toBe(199.9);
  });

  it("aceita datas opcionais de trial e delivery", async () => {
    const repo = new InMemoryOrderRepo();
    const usecase = new CreateOrder(repo);

    const trial = new Date();
    const delivery = new Date(Date.now() + 86400000);

    const order = await usecase.execute({
      clientId: randomUUID(),
      totalValue: 50,
      status: "MEASURING",
      trialDate: trial,
      deliveryDate: delivery,
    });

    expect(order.status).toBe("MEASURING");
    expect(order.trialDate?.toISOString()).toBe(trial.toISOString());
    expect(order.deliveryDate?.toISOString()).toBe(delivery.toISOString());
  });
});
