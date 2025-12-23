import { z } from "zod";
import { MeasurementRepository } from "../../domain/measurement/MeasurementRepository";

const deleteMeasurementSchema = z.object({ id: z.string().uuid() });
export type DeleteMeasurementInput = z.infer<typeof deleteMeasurementSchema>;

export class DeleteMeasurement {
  constructor(private repo: MeasurementRepository) {}
  async execute(input: DeleteMeasurementInput): Promise<void> {
    const { id } = deleteMeasurementSchema.parse(input);
    await this.repo.delete(id);
  }
}
