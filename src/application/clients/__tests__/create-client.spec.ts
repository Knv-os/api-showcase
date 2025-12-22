import { CreateClient } from "../CreateClient";
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
    const created = new Client({
      id: randomUUID(),
      name: data.name,
      email: data.email ?? null,
      phone: data.phone,
      document: data.document ?? null,
      createdAt: now,
      updatedAt: now,
    });
    this.items.push(created);
    return created;
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
  async delete(id: string): Promise<void> {
    this.items = this.items.filter((c) => c.id !== id);
  }
}

describe("CreateClient", () => {
  it("cria cliente validando unicidade de email/documento", async () => {
    const repo = new InMemoryClientRepo();
    const usecase = new CreateClient(repo);

    const c = await usecase.execute({
      name: "ACME",
      email: "acme@ex.com",
      phone: "123",
      document: "111",
    });
    expect(c).toBeInstanceOf(Client);

    await expect(
      usecase.execute({ name: "Other", email: "acme@ex.com", phone: "999" })
    ).rejects.toThrow("Client email already in use");
    await expect(
      usecase.execute({ name: "Other2", phone: "999", document: "111" })
    ).rejects.toThrow("Client document already in use");
  });
});
