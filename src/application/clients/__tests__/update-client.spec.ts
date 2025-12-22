import { UpdateClient } from "../UpdateClient";
import { Client } from "../../../domain/client/Client";
import {
  ClientRepository,
  CreateClientData,
  UpdateClientData,
} from "../../../domain/client/ClientRepository";
import { randomUUID } from "node:crypto";

class InMemoryClientRepo implements ClientRepository {
  private items: Client[] = [];
  async create(data: CreateClientData): Promise<Client> {
    const now = new Date();
    const c = new Client({
      id: randomUUID(),
      name: data.name,
      email: data.email ?? null,
      phone: data.phone,
      document: data.document ?? null,
      createdAt: now,
      updatedAt: now,
    });
    this.items.push(c);
    return c;
  }
  async findById(id: string): Promise<Client | null> {
    return this.items.find((c) => c.id === id) ?? null;
  }
  async findByEmail(email: string): Promise<Client | null> {
    return this.items.find((c) => c.email === email) ?? null;
  }
  async findByDocument(document: string): Promise<Client | null> {
    return this.items.find((c) => c.document === document) ?? null;
  }
  async list(): Promise<Client[]> {
    return [...this.items];
  }
  async update(id: string, data: UpdateClientData): Promise<Client> {
    const idx = this.items.findIndex((c) => c.id === id);
    if (idx < 0) throw new Error("not found");
    const prev = this.items[idx];
    const updated = new Client({
      id: prev.id,
      name: data.name ?? prev.name,
      email: (data.email === undefined ? prev.email : data.email) ?? null,
      phone: data.phone ?? prev.phone,
      document:
        (data.document === undefined ? prev.document : data.document) ?? null,
      createdAt: prev.createdAt,
      updatedAt: new Date(),
    });
    this.items[idx] = updated;
    return updated;
  }
  async delete(): Promise<void> {}
}

describe("UpdateClient", () => {
  it("atualiza respeitando unicidade de email/documento", async () => {
    const repo = new InMemoryClientRepo();
    const c1 = await repo.create({
      name: "A",
      email: "a@a.com",
      phone: "1",
      document: "111",
    });
    const c2 = await repo.create({
      name: "B",
      email: "b@b.com",
      phone: "2",
      document: "222",
    });

    const usecase = new UpdateClient(repo);

    await expect(
      usecase.execute({ id: c2.id, email: "a@a.com" })
    ).rejects.toThrow("Client email already in use");
    await expect(
      usecase.execute({ id: c2.id, document: "111" })
    ).rejects.toThrow("Client document already in use");

    const updated = await usecase.execute({
      id: c2.id,
      name: "C",
      email: null,
      document: null,
    });
    expect(updated.name).toBe("C");
    // Como o caso de uso envia undefined quando null é passado, o repositório mantém os valores anteriores
    expect(updated.email).toBe("b@b.com");
    expect(updated.document).toBe("222");
  });

  it("lança erro quando nenhum campo para atualizar é enviado", async () => {
    const repo = new InMemoryClientRepo();
    const c = await repo.create({ name: "A", phone: "1" });
    const usecase = new UpdateClient(repo);
    await expect(usecase.execute({ id: c.id } as any)).rejects.toThrow(
      "At least one field to update must be provided"
    );
  });

  it("lança erro para email inválido", async () => {
    const repo = new InMemoryClientRepo();
    const c = await repo.create({ name: "A", phone: "1" });
    const usecase = new UpdateClient(repo);
    await expect(
      usecase.execute({ id: c.id, email: "not-an-email" as any })
    ).rejects.toThrow();
  });
});
