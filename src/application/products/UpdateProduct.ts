import { z } from "zod";
import { Product } from "../../domain/product/Product";
import { ProductRepository } from "../../domain/product/ProductRepository";

const updateProductSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().min(1).optional(),
    description: z.string().trim().nullish(),
    basePrice: z.number().nonnegative().optional(),
    supplierId: z.string().uuid().nullish(),
  })
  .refine((data) => Object.keys(data).some((k) => k !== "id"), {
    message: "At least one field to update must be provided",
  });

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export class UpdateProduct {
  constructor(private repo: ProductRepository) {}

  async execute(input: UpdateProductInput): Promise<Product> {
    const data = updateProductSchema.parse(input);
    const updated = await this.repo.update(data.id, {
      name: data.name,
      description: data.description ?? undefined,
      basePrice: data.basePrice,
      supplierId: data.supplierId ?? undefined,
    });
    return updated;
  }
}
