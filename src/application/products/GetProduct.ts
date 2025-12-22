import { z } from "zod";
import { Product } from "../../domain/product/Product";
import { ProductRepository } from "../../domain/product/ProductRepository";

const getProductSchema = z.object({ id: z.string().uuid() });
export type GetProductInput = z.infer<typeof getProductSchema>;

export class GetProduct {
  constructor(private repo: ProductRepository) {}
  async execute(input: GetProductInput): Promise<Product> {
    const { id } = getProductSchema.parse(input);
    const product = await this.repo.findById(id);
    if (!product) throw new Error("Product not found");
    return product;
  }
}
