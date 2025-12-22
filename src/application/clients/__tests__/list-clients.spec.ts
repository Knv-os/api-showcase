import { ListClients } from "../ListClients";
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
  async findById(): Promise<Client | null> {
    return null;
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

describe("ListClients", () => {
  it("lista clientes do repositório", async () => {
    const repo = new InMemoryClientRepo();
    await repo.create({ name: "A", phone: "1" });
    await repo.create({ name: "B", phone: "2" });

    const usecase = new ListClients(repo);
    const list = await usecase.execute();

    expect(list).toHaveLength(2);
    expect(list[0]).toBeInstanceOf(Client);
  });
});
