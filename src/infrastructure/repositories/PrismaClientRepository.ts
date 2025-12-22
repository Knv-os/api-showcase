import { prisma } from "../prisma/client";
import { Client } from "../../domain/client/Client";
import {
  ClientRepository,
  CreateClientData,
  UpdateClientData,
} from "../../domain/client/ClientRepository";
import { randomUUID } from "node:crypto";

export class PrismaClientRepository implements ClientRepository {
  async create(data: CreateClientData): Promise<Client> {
    const created = await prisma.client.create({
      data: {
        id: randomUUID(),
        name: data.name,
        email: data.email ?? null,
        phone: data.phone,
        document: data.document ?? null,
      },
    });
    return new Client({
      id: created.id,
      name: created.name,
      email: created.email ?? null,
      phone: created.phone,
      document: created.document ?? null,
      createdAt: created.createdAt,
      updatedAt: created.createdAt,
    });
  }

  async findById(id: string): Promise<Client | null> {
    const found = await prisma.client.findUnique({ where: { id } });
    return found
      ? new Client({
          id: found.id,
          name: found.name,
          email: found.email ?? null,
          phone: found.phone,
          document: found.document ?? null,
          createdAt: found.createdAt,
          updatedAt: found.createdAt,
        })
      : null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const found = await prisma.client.findUnique({ where: { email } });
    return found
      ? new Client({
          id: found.id,
          name: found.name,
          email: found.email ?? null,
          phone: found.phone,
          document: found.document ?? null,
          createdAt: found.createdAt,
          updatedAt: found.createdAt,
        })
      : null;
  }

  async findByDocument(document: string): Promise<Client | null> {
    const found = await prisma.client.findUnique({ where: { document } });
    return found
      ? new Client({
          id: found.id,
          name: found.name,
          email: found.email ?? null,
          phone: found.phone,
          document: found.document ?? null,
          createdAt: found.createdAt,
          updatedAt: found.createdAt,
        })
      : null;
  }

  async list(): Promise<Client[]> {
    const rows = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows.map(
      (r) =>
        new Client({
          id: r.id,
          name: r.name,
          email: r.email ?? null,
          phone: r.phone,
          document: r.document ?? null,
          createdAt: r.createdAt,
          updatedAt: r.createdAt,
        })
    );
  }

  async update(id: string, data: UpdateClientData): Promise<Client> {
    const updated = await prisma.client.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        document: data.document,
      },
    });
    return new Client({
      id: updated.id,
      name: updated.name,
      email: updated.email ?? null,
      phone: updated.phone,
      document: updated.document ?? null,
      createdAt: updated.createdAt,
      updatedAt: new Date(),
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.client.delete({ where: { id } });
  }
}
