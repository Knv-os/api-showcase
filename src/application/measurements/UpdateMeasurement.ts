import { z } from "zod";
import { Measurement } from "../../domain/measurement/Measurement";
import { MeasurementRepository } from "../../domain/measurement/MeasurementRepository";

const updateMeasurementSchema = z.object({
  id: z.string().uuid(),
  neck: z.number().positive().nullish(),
  chest: z.number().positive().nullish(),
  waist: z.number().positive().nullish(),
  sleeve: z.number().positive().nullish(),
  length: z.number().positive().nullish(),
  observations: z.string().trim().nullish(),
});

export type UpdateMeasurementInput = z.infer<typeof updateMeasurementSchema>;

export class UpdateMeasurement {
  constructor(private repo: MeasurementRepository) {}
  async execute(input: UpdateMeasurementInput): Promise<Measurement> {
    const data = updateMeasurementSchema.parse(input);
    return this.repo.update(data.id, {
      neck: data.neck ?? null,
      chest: data.chest ?? null,
      waist: data.waist ?? null,
      sleeve: data.sleeve ?? null,
      length: data.length ?? null,
      observations: data.observations ?? null,
    });
  }
}
