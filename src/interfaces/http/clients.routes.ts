import { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaClientRepository } from "../../infrastructure/repositories/PrismaClientRepository";
import { prisma } from "../../infrastructure/prisma/client";
import { getPaginationParams, buildPaginated } from "../../shared/pagination";
import { CreateClient } from "../../application/clients/CreateClient";
import { GetClient } from "../../application/clients/GetClient";
import { ListClients } from "../../application/clients/ListClients";
import { UpdateClient } from "../../application/clients/UpdateClient";

export async function clientsRoutes(app: FastifyInstance) {
  const repo = new PrismaClientRepository();
  const createClient = new CreateClient(repo);
  const getClient = new GetClient(repo);
  const listClients = new ListClients(repo);
  const updateClient = new UpdateClient(repo);

  app.post("/clients", async (request, reply) => {
    const bodySchema = z.object({
      name: z.string().min(1),
      email: z.string().trim().toLowerCase().email().nullish(),
      phone: z.string().min(1),
      document: z.string().trim().nullish(),
    });
    const body = bodySchema.parse(request.body);
    const client = await createClient.execute(body);
    return reply.code(201).send(client);
  });

  app.get("/clients", async (_request, reply) => {
    const { page, perPage } = getPaginationParams((_request as any).query);
    const querySchema = z.object({
      q: z.string().trim().min(1).optional(),
      sortBy: z.enum(["name", "createdAt"]).default("name").optional(),
      sortOrder: z.enum(["asc", "desc"]).default("asc").optional(),
    });
    const {
      q,
      sortBy = "name",
      sortOrder = "asc",
    } = querySchema.parse((_request as any).query ?? {});

    await listClients.execute();
    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            { phone: { contains: q, mode: "insensitive" as const } },
            { document: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : undefined;

    const [total, rows] = await Promise.all([
      prisma.client.count({ where }),
      prisma.client.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
    ]);

    return reply.send(buildPaginated(rows, page, perPage, total));
  });

  app.get("/clients/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);
    const client = await getClient.execute({ id });
    return reply.send(client);
  });

  app.put("/clients/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const bodySchema = z.object({
      name: z.string().min(1).optional(),
      email: z.string().trim().toLowerCase().email().nullish(),
      phone: z.string().min(1).optional(),
      document: z.string().trim().nullish(),
    });
    const { id } = paramsSchema.parse(request.params);
    const body = bodySchema.parse(request.body);
    const client = await updateClient.execute({ id, ...body });
    return reply.send(client);
  });

  app.delete("/clients/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);
    await repo.delete(id);
    return reply.code(204).send();
  });
}
