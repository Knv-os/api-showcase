import { z } from "zod";
import { Supplier } from "../../domain/supplier/Supplier";
import { SupplierRepository } from "../../domain/supplier/SupplierRepository";

const createSupplierSchema = z.object({
  name: z.string().min(1),
  contact: z.string().trim().nullish(),
  category: z.string().trim().nullish(),
});

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;

export class CreateSupplier {
  constructor(private repo: SupplierRepository) {}

  async execute(input: CreateSupplierInput): Promise<Supplier> {
    const data = createSupplierSchema.parse(input);
    return this.repo.create({
      name: data.name,
      contact: data.contact ?? null,
      category: data.category ?? null,
    });
  }
}
