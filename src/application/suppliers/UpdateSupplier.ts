import { z } from "zod";
import { Supplier } from "../../domain/supplier/Supplier";
import { SupplierRepository } from "../../domain/supplier/SupplierRepository";

const updateSupplierSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().min(1).optional(),
    contact: z.string().trim().nullish(),
    category: z.string().trim().nullish(),
  })
  .refine((data) => Object.keys(data).some((k) => k !== "id"), {
    message: "At least one field to update must be provided",
  });

export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;

export class UpdateSupplier {
  constructor(private repo: SupplierRepository) {}

  async execute(input: UpdateSupplierInput): Promise<Supplier> {
    const data = updateSupplierSchema.parse(input);
    const updated = await this.repo.update(data.id, {
      name: data.name,
      contact: data.contact ?? undefined,
      category: data.category ?? undefined,
    });
    return updated;
  }
}
