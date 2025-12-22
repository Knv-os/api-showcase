import { z } from "zod";
import { ProductRepository } from "../../domain/product/ProductRepository";

const deleteProductSchema = z.object({ id: z.string().uuid() });
export type DeleteProductInput = z.infer<typeof deleteProductSchema>;

export class DeleteProduct {
  constructor(private repo: ProductRepository) {}
  async execute(input: DeleteProductInput): Promise<void> {
    const { id } = deleteProductSchema.parse(input);
    const existing = await this.repo.findById(id);
    if (!existing) throw new Error("Product not found");
    await this.repo.delete(id);
  }
}
