import { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaMeasurementRepository } from "../../infrastructure/repositories/PrismaMeasurementRepository";
import { CreateMeasurement } from "../../application/measurements/CreateMeasurement";
import { GetMeasurement } from "../../application/measurements/GetMeasurement";
import { ListMeasurements } from "../../application/measurements/ListMeasurements";
import { UpdateMeasurement } from "../../application/measurements/UpdateMeasurement";
import { DeleteMeasurement } from "../../application/measurements/DeleteMeasurement";
import { prisma } from "../../infrastructure/prisma/client";

export async function measurementsRoutes(app: FastifyInstance) {
  const repo = new PrismaMeasurementRepository();
  const createMeasurement = new CreateMeasurement(repo);
  const getMeasurement = new GetMeasurement(repo);
  const listMeasurements = new ListMeasurements(repo);
  const updateMeasurement = new UpdateMeasurement(repo);
  const deleteMeasurement = new DeleteMeasurement(repo);

  app.post("/measurements", async (request, reply) => {
    const bodySchema = z.object({
      clientId: z.string().uuid(),
      neck: z.number().positive().nullish(),
      chest: z.number().positive().nullish(),
      waist: z.number().positive().nullish(),
      sleeve: z.number().positive().nullish(),
      length: z.number().positive().nullish(),
      observations: z.string().trim().nullish(),
    });
    const body = bodySchema.parse(request.body);
    const created = await createMeasurement.execute(body);
    const expanded = await prisma.measurement.findUnique({
      where: { id: created.id },
      include: { client: true },
    });
    return reply.code(201).send(expanded);
  });

  app.get("/measurements", async (_request, reply) => {
    await listMeasurements.execute();
    const rows = await prisma.measurement.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: true },
    });
    return reply.send(rows);
  });

  app.get("/measurements/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);
    await getMeasurement.execute({ id });
    const expanded = await prisma.measurement.findUnique({
      where: { id },
      include: { client: true },
    });
    return reply.send(expanded);
  });

  app.put("/measurements/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const bodySchema = z.object({
      neck: z.number().positive().nullish(),
      chest: z.number().positive().nullish(),
      waist: z.number().positive().nullish(),
      sleeve: z.number().positive().nullish(),
      length: z.number().positive().nullish(),
      observations: z.string().trim().nullish(),
    });
    const { id } = paramsSchema.parse(request.params);
    const body = bodySchema.parse(request.body);
    const updated = await updateMeasurement.execute({ id, ...body });
    const expanded = await prisma.measurement.findUnique({
      where: { id: updated.id },
      include: { client: true },
    });
    return reply.send(expanded);
  });

  app.delete("/measurements/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);
    await deleteMeasurement.execute({ id });
    return reply.code(204).send();
  });
}
