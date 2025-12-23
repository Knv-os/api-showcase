import { z } from "zod";
import { Measurement } from "../../domain/measurement/Measurement";
import { MeasurementRepository } from "../../domain/measurement/MeasurementRepository";

const createMeasurementSchema = z.object({
  clientId: z.string().uuid(),
  neck: z.number().positive().nullish(),
  chest: z.number().positive().nullish(),
  waist: z.number().positive().nullish(),
  sleeve: z.number().positive().nullish(),
  length: z.number().positive().nullish(),
  observations: z.string().trim().nullish(),
});

export type CreateMeasurementInput = z.infer<typeof createMeasurementSchema>;

export class CreateMeasurement {
  constructor(private repo: MeasurementRepository) {}
  async execute(input: CreateMeasurementInput): Promise<Measurement> {
    const data = createMeasurementSchema.parse(input);
    return this.repo.create({
      clientId: data.clientId,
      neck: data.neck ?? null,
      chest: data.chest ?? null,
      waist: data.waist ?? null,
      sleeve: data.sleeve ?? null,
      length: data.length ?? null,
      observations: data.observations ?? null,
    });
  }
}
