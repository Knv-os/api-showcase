import { prisma } from "../prisma/client";
import { randomUUID } from "node:crypto";
import { Measurement } from "../../domain/measurement/Measurement";
import {
  CreateMeasurementData,
  MeasurementRepository,
  UpdateMeasurementData,
} from "../../domain/measurement/MeasurementRepository";

export class PrismaMeasurementRepository implements MeasurementRepository {
  async create(data: CreateMeasurementData): Promise<Measurement> {
    const created = await prisma.measurement.create({
      data: {
        id: randomUUID(),
        clientId: data.clientId,
        neck: data.neck ?? null,
        chest: data.chest ?? null,
        waist: data.waist ?? null,
        sleeve: data.sleeve ?? null,
        length: data.length ?? null,
        observations: data.observations ?? null,
      },
    });
    return new Measurement({
      id: created.id,
      clientId: created.clientId,
      neck: created.neck ?? null,
      chest: created.chest ?? null,
      waist: created.waist ?? null,
      sleeve: created.sleeve ?? null,
      length: created.length ?? null,
      observations: created.observations ?? null,
      createdAt: created.createdAt,
    });
  }

  async findById(id: string): Promise<Measurement | null> {
    const found = await prisma.measurement.findUnique({ where: { id } });
    return found
      ? new Measurement({
          id: found.id,
          clientId: found.clientId,
          neck: found.neck ?? null,
          chest: found.chest ?? null,
          waist: found.waist ?? null,
          sleeve: found.sleeve ?? null,
          length: found.length ?? null,
          observations: found.observations ?? null,
          createdAt: found.createdAt,
        })
      : null;
  }

  async list(): Promise<Measurement[]> {
    const rows = await prisma.measurement.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows.map(
      (r) =>
        new Measurement({
          id: r.id,
          clientId: r.clientId,
          neck: r.neck ?? null,
          chest: r.chest ?? null,
          waist: r.waist ?? null,
          sleeve: r.sleeve ?? null,
          length: r.length ?? null,
          observations: r.observations ?? null,
          createdAt: r.createdAt,
        })
    );
  }

  async update(id: string, data: UpdateMeasurementData): Promise<Measurement> {
    const updated = await prisma.measurement.update({
      where: { id },
      data: {
        neck: data.neck ?? undefined,
        chest: data.chest ?? undefined,
        waist: data.waist ?? undefined,
        sleeve: data.sleeve ?? undefined,
        length: data.length ?? undefined,
        observations: data.observations ?? undefined,
      },
    });
    return new Measurement({
      id: updated.id,
      clientId: updated.clientId,
      neck: updated.neck ?? null,
      chest: updated.chest ?? null,
      waist: updated.waist ?? null,
      sleeve: updated.sleeve ?? null,
      length: updated.length ?? null,
      observations: updated.observations ?? null,
      createdAt: updated.createdAt,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.measurement.delete({ where: { id } });
  }
}
