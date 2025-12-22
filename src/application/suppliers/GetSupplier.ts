import { z } from "zod";
import { Supplier } from "../../domain/supplier/Supplier";
import { SupplierRepository } from "../../domain/supplier/SupplierRepository";

const getSupplierSchema = z.object({ id: z.string().uuid() });
export type GetSupplierInput = z.infer<typeof getSupplierSchema>;

export class GetSupplier {
  constructor(private repo: SupplierRepository) {}
  async execute(input: GetSupplierInput): Promise<Supplier> {
    const { id } = getSupplierSchema.parse(input);
    const supplier = await this.repo.findById(id);
    if (!supplier) throw new Error("Supplier not found");
    return supplier;
  }
}
