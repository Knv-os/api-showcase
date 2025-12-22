import { GetClient } from "../GetClient";
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
  async findByEmail(): Promise<Client | null> {
    return null;
  }
  async findByDocument(): Promise<Client | null> {
    return null;
  }
  async list(): Promise<Client[]> {
    return [...this.items];
  }
  async update(): Promise<Client> {
    throw new Error("not used");
  }
  async delete(): Promise<void> {
    throw new Error("not used");
  }
}

describe("GetClient", () => {
  it("retorna cliente existente", async () => {
    const repo = new InMemoryClientRepo();
    const created = await repo.create({ name: "ACME", phone: "1" });

    const usecase = new GetClient(repo);
    const got = await usecase.execute({ id: created.id });
    expect(got.id).toBe(created.id);
  });

  it("erro quando cliente não encontrado", async () => {
    const repo = new InMemoryClientRepo();
    const usecase = new GetClient(repo);
    await expect(usecase.execute({ id: randomUUID() })).rejects.toThrow(
      "Client not found"
    );
  });
});
