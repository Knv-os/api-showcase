import Fastify from "fastify";
import { ordersRoutes } from "../orders.routes";
import { randomUUID } from "node:crypto";

// Mock do repositório Prisma usado nas rotas
jest.mock("../../../infrastructure/repositories/PrismaOrderRepository", () => {
  class InMemoryOrderRepo {
    items: any[] = [];

    async create(data: any) {
      const now = new Date();
      const created = {
        id: randomUUID(),
        clientId: data.clientId,
        status: data.status ?? "DRAFT",
        totalValue: data.totalValue,
        trialDate: data.trialDate ?? null,
        deliveryDate: data.deliveryDate ?? null,
        createdAt: now,
        updatedAt: now,
      };
      this.items.push(created);
      return created;
    }
    async findById(id: string) {
      return this.items.find((o) => o.id === id) ?? null;
    }
    async list() {
      // imita orderBy desc por createdAt
      return [...this.items].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    }
    async update(id: string, data: any) {
      const idx = this.items.findIndex((o) => o.id === id);
      if (idx < 0) throw new Error("not found");
      const prev = this.items[idx];
      const updated = {
        ...prev,
        status: data.status ?? prev.status,
        totalValue: data.totalValue ?? prev.totalValue,
        trialDate: data.trialDate ?? prev.trialDate,
        deliveryDate: data.deliveryDate ?? prev.deliveryDate,
        updatedAt: new Date(),
      };
      this.items[idx] = updated;
      return updated;
    }
    async delete(id: string) {
      this.items = this.items.filter((o) => o.id !== id);
    }
  }
  return { PrismaOrderRepository: InMemoryOrderRepo };
});

function buildApp() {
  const app = Fastify();
  app.setErrorHandler((error: any, _req, reply) => {
    if (
      typeof error?.message === "string" &&
      error.message.includes("At least one field")
    ) {
      return reply.status(400).send({ error: error.message });
    }
    if (error?.message === "Order not found") {
      return reply.status(404).send({ error: error.message });
    }
    return reply.status(500).send({ error: "Internal Server Error" });
  });
  return app;
}

describe("Orders HTTP routes", () => {
  it("POST /orders cria um pedido", async () => {
    const app = buildApp();
    await ordersRoutes(app);

    const res = await app.inject({
      method: "POST",
      url: "/orders",
      payload: { clientId: randomUUID(), totalValue: 123.45 },
    });

    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.id).toBeDefined();
    expect(body.status).toBe("DRAFT");
    expect(body.totalValue).toBe(123.45);
  });

  it("GET /orders lista pedidos", async () => {
    const app = buildApp();
    await ordersRoutes(app);

    await app.inject({
      method: "POST",
      url: "/orders",
      payload: { clientId: randomUUID(), totalValue: 10 },
    });
    await app.inject({
      method: "POST",
      url: "/orders",
      payload: { clientId: randomUUID(), totalValue: 20 },
    });

    const res = await app.inject({ method: "GET", url: "/orders" });
    expect(res.statusCode).toBe(200);
    const list = res.json();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThanOrEqual(2);
  });

  it("GET /orders/:id retorna pedido", async () => {
    const app = buildApp();
    await ordersRoutes(app);

    const created = await app.inject({
      method: "POST",
      url: "/orders",
      payload: { clientId: randomUUID(), totalValue: 33 },
    });
    const id = created.json().id as string;

    const res = await app.inject({ method: "GET", url: `/orders/${id}` });
    expect(res.statusCode).toBe(200);
    expect(res.json().id).toBe(id);
  });

  it("PUT /orders/:id atualiza status e totalValue", async () => {
    const app = buildApp();
    await ordersRoutes(app);

    const created = await app.inject({
      method: "POST",
      url: "/orders",
      payload: { clientId: randomUUID(), totalValue: 40 },
    });
    const id = created.json().id as string;

    const res = await app.inject({
      method: "PUT",
      url: `/orders/${id}`,
      payload: { status: "READY", totalValue: 55 },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().status).toBe("READY");
    expect(res.json().totalValue).toBe(55);
  });

  it("DELETE /orders/:id remove o pedido", async () => {
    const app = buildApp();
    await ordersRoutes(app);

    const created = await app.inject({
      method: "POST",
      url: "/orders",
      payload: { clientId: randomUUID(), totalValue: 70 },
    });
    const id = created.json().id as string;

    const res = await app.inject({ method: "DELETE", url: `/orders/${id}` });
    expect(res.statusCode).toBe(204);

    const notFound = await app.inject({ method: "GET", url: `/orders/${id}` });
    expect(notFound.statusCode).toBe(404);
  });
});
