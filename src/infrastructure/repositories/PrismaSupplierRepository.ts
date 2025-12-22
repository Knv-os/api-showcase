import { prisma } from "../prisma/client";
import { Supplier } from "../../domain/supplier/Supplier";
import {
  CreateSupplierData,
  SupplierRepository,
  UpdateSupplierData,
} from "../../domain/supplier/SupplierRepository";
import { randomUUID } from "node:crypto";

export class PrismaSupplierRepository implements SupplierRepository {
  async create(data: CreateSupplierData): Promise<Supplier> {
    const created = await prisma.supplier.create({
      data: {
        id: randomUUID(),
        name: data.name,
        contact: data.contact ?? null,
        category: data.category ?? null,
      },
    });
    return new Supplier({
      id: created.id,
      name: created.name,
      contact: created.contact ?? null,
      category: created.category ?? null,
    });
  }

  async findById(id: string): Promise<Supplier | null> {
    const found = await prisma.supplier.findUnique({ where: { id } });
    return found
      ? new Supplier({
          id: found.id,
          name: found.name,
          contact: found.contact ?? null,
          category: found.category ?? null,
        })
      : null;
  }

  async list(): Promise<Supplier[]> {
    const rows = await prisma.supplier.findMany({ orderBy: { name: "asc" } });
    return rows.map(
      (r) =>
        new Supplier({
          id: r.id,
          name: r.name,
          contact: r.contact ?? null,
          category: r.category ?? null,
        })
    );
  }

  async update(id: string, data: UpdateSupplierData): Promise<Supplier> {
    const updated = await prisma.supplier.update({
      where: { id },
      data: {
        name: data.name,
        contact: data.contact ?? undefined,
        category: data.category ?? undefined,
      },
    });
    return new Supplier({
      id: updated.id,
      name: updated.name,
      contact: updated.contact ?? null,
      category: updated.category ?? null,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.supplier.delete({ where: { id } });
  }
}
