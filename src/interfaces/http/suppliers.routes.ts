import { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaSupplierRepository } from "../../infrastructure/repositories/PrismaSupplierRepository";
import { CreateSupplier } from "../../application/suppliers/CreateSupplier";
import { GetSupplier } from "../../application/suppliers/GetSupplier";
import { ListSuppliers } from "../../application/suppliers/ListSuppliers";
import { UpdateSupplier } from "../../application/suppliers/UpdateSupplier";
import { DeleteSupplier } from "../../application/suppliers/DeleteSupplier";

export async function suppliersRoutes(app: FastifyInstance) {
  const repo = new PrismaSupplierRepository();
  const createSupplier = new CreateSupplier(repo);
  const getSupplier = new GetSupplier(repo);
  const listSuppliers = new ListSuppliers(repo);
  const updateSupplier = new UpdateSupplier(repo);
  const deleteSupplier = new DeleteSupplier(repo);

  app.post("/suppliers", async (request, reply) => {
    const bodySchema = z.object({
      name: z.string().min(1),
      contact: z.string().trim().nullish(),
      category: z.string().trim().nullish(),
    });
    const body = bodySchema.parse(request.body);
    const created = await createSupplier.execute(body);
    return reply.code(201).send(created);
  });

  app.get("/suppliers", async (_request, reply) => {
    const suppliers = await listSuppliers.execute();
    return reply.send(suppliers);
  });

  app.get("/suppliers/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);
    const supplier = await getSupplier.execute({ id });
    return reply.send(supplier);
  });

  app.put("/suppliers/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const bodySchema = z.object({
      name: z.string().min(1).optional(),
      contact: z.string().trim().nullish(),
      category: z.string().trim().nullish(),
    });
    const { id } = paramsSchema.parse(request.params);
    const body = bodySchema.parse(request.body);
    const updated = await updateSupplier.execute({ id, ...body });
    return reply.send(updated);
  });

  app.delete("/suppliers/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);
    await deleteSupplier.execute({ id });
    return reply.code(204).send();
  });
}
