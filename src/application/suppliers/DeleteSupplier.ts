import { z } from "zod";
import { SupplierRepository } from "../../domain/supplier/SupplierRepository";

const deleteSupplierSchema = z.object({ id: z.string().uuid() });
export type DeleteSupplierInput = z.infer<typeof deleteSupplierSchema>;

export class DeleteSupplier {
  constructor(private repo: SupplierRepository) {}
  async execute(input: DeleteSupplierInput): Promise<void> {
    const { id } = deleteSupplierSchema.parse(input);
    const existing = await this.repo.findById(id);
    if (!existing) throw new Error("Supplier not found");
    await this.repo.delete(id);
  }
}
