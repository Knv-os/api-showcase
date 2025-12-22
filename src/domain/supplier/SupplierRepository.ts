import { Supplier } from "./Supplier";

export interface CreateSupplierData {
  name: string;
  contact?: string | null;
  category?: string | null;
}

export interface UpdateSupplierData {
  name?: string;
  contact?: string | null;
  category?: string | null;
}

export interface SupplierRepository {
  create(data: CreateSupplierData): Promise<Supplier>;
  findById(id: string): Promise<Supplier | null>;
  list(): Promise<Supplier[]>;
  update(id: string, data: UpdateSupplierData): Promise<Supplier>;
  delete(id: string): Promise<void>;
}
