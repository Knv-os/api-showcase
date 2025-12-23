import { z } from "zod";
import { Measurement } from "../../domain/measurement/Measurement";
import { MeasurementRepository } from "../../domain/measurement/MeasurementRepository";

const getMeasurementSchema = z.object({ id: z.string().uuid() });
export type GetMeasurementInput = z.infer<typeof getMeasurementSchema>;

export class GetMeasurement {
  constructor(private repo: MeasurementRepository) {}
  async execute(input: GetMeasurementInput): Promise<Measurement> {
    const { id } = getMeasurementSchema.parse(input);
    const found = await this.repo.findById(id);
    if (!found) throw new Error("Measurement not found");
    return found;
  }
}
