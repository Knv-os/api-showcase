import { Measurement } from "../../domain/measurement/Measurement";
import { MeasurementRepository } from "../../domain/measurement/MeasurementRepository";

export class ListMeasurements {
  constructor(private repo: MeasurementRepository) {}
  async execute(): Promise<Measurement[]> {
    return this.repo.list();
  }
}
