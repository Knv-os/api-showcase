import { z } from "zod";
import { Product } from "../../domain/product/Product";
import { ProductRepository } from "../../domain/product/ProductRepository";

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().trim().nullish(),
  basePrice: z.number().nonnegative(),
  supplierId: z.string().uuid().nullish(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export class CreateProduct {
  constructor(private repo: ProductRepository) {}

  async execute(input: CreateProductInput): Promise<Product> {
    const data = createProductSchema.parse(input);
    const product = await this.repo.create({
      name: data.name,
      description: data.description ?? null,
      basePrice: data.basePrice,
      supplierId: data.supplierId ?? null,
    });
    return product;
  }
}
