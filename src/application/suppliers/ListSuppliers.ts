import { Supplier } from "../../domain/supplier/Supplier";
import { SupplierRepository } from "../../domain/supplier/SupplierRepository";

export class ListSuppliers {
  constructor(private repo: SupplierRepository) {}

  async execute(): Promise<Supplier[]> {
    return this.repo.list();
  }
}
