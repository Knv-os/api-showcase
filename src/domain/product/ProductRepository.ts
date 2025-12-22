import { Product } from "./Product";

export interface CreateProductData {
  name: string;
  description?: string | null;
  basePrice: number;
  supplierId?: string | null;
}

export interface UpdateProductData {
  name?: string;
  description?: string | null;
  basePrice?: number;
  supplierId?: string | null;
}

export interface ProductRepository {
  create(data: CreateProductData): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  list(): Promise<Product[]>;
  update(id: string, data: UpdateProductData): Promise<Product>;
  delete(id: string): Promise<void>;
}
