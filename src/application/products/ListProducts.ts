import { Product } from "../../domain/product/Product";
import { ProductRepository } from "../../domain/product/ProductRepository";

export class ListProducts {
  constructor(private repo: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.repo.list();
  }
}
