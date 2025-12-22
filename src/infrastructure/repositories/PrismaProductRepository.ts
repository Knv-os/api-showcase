import { prisma } from "../prisma/client";
import { Product } from "../../domain/product/Product";
import {
  CreateProductData,
  ProductRepository,
  UpdateProductData,
} from "../../domain/product/ProductRepository";
import { randomUUID } from "node:crypto";

export class PrismaProductRepository implements ProductRepository {
  async create(data: CreateProductData): Promise<Product> {
    const created = await prisma.product.create({
      data: {
        id: randomUUID(),
        name: data.name,
        description: data.description ?? null,
        basePrice: data.basePrice,
        supplierId: data.supplierId ?? null,
      },
    });
    return new Product({
      id: created.id,
      name: created.name,
      description: created.description ?? null,
      basePrice: Number(created.basePrice),
      supplierId: created.supplierId ?? null,
    });
  }

  async findById(id: string): Promise<Product | null> {
    const found = await prisma.product.findUnique({ where: { id } });
    return found
      ? new Product({
          id: found.id,
          name: found.name,
          description: found.description ?? null,
          basePrice: Number(found.basePrice),
          supplierId: found.supplierId ?? null,
        })
      : null;
  }

  async list(): Promise<Product[]> {
    const rows = await prisma.product.findMany({ orderBy: { name: "asc" } });
    return rows.map(
      (r) =>
        new Product({
          id: r.id,
          name: r.name,
          description: r.description ?? null,
          basePrice: Number(r.basePrice),
          supplierId: r.supplierId ?? null,
        })
    );
  }

  async update(id: string, data: UpdateProductData): Promise<Product> {
    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description ?? undefined,
        basePrice: data.basePrice,
        supplierId: data.supplierId ?? undefined,
      },
    });
    return new Product({
      id: updated.id,
      name: updated.name,
      description: updated.description ?? null,
      basePrice: Number(updated.basePrice),
      supplierId: updated.supplierId ?? null,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }
}
