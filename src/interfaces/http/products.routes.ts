import { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaProductRepository } from "../../infrastructure/repositories/PrismaProductRepository";
import { CreateProduct } from "../../application/products/CreateProduct";
import { GetProduct } from "../../application/products/GetProduct";
import { ListProducts } from "../../application/products/ListProducts";
import { UpdateProduct } from "../../application/products/UpdateProduct";
import { DeleteProduct } from "../../application/products/DeleteProduct";
import { prisma } from "../../infrastructure/prisma/client";

export async function productsRoutes(app: FastifyInstance) {
  const repo = new PrismaProductRepository();
  const createProduct = new CreateProduct(repo);
  const getProduct = new GetProduct(repo);
  const listProducts = new ListProducts(repo);
  const updateProduct = new UpdateProduct(repo);
  const deleteProduct = new DeleteProduct(repo);

  app.post("/products", async (request, reply) => {
    const bodySchema = z.object({
      name: z.string().min(1),
      description: z.string().trim().nullish(),
      basePrice: z.number().nonnegative(),
      supplierId: z.string().uuid().nullish(),
    });

    const body = bodySchema.parse(request.body);
    const created = await createProduct.execute(body);
    const expanded = await prisma.product.findUnique({
      where: { id: created.id },
      include: { supplier: true },
    });
    return reply.code(201).send(expanded);
  });

  app.get("/products", async (_request, reply) => {
    await listProducts.execute();
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
      include: { supplier: true },
    });
    return reply.send(products);
  });

  app.get("/products/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);
    await getProduct.execute({ id });
    const expanded = await prisma.product.findUnique({
      where: { id },
      include: { supplier: true },
    });
    return reply.send(expanded);
  });

  app.put("/products/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const bodySchema = z.object({
      name: z.string().min(1).optional(),
      description: z.string().trim().nullish(),
      basePrice: z.number().nonnegative().optional(),
      supplierId: z.string().uuid().nullish(),
    });
    const { id } = paramsSchema.parse(request.params);
    const body = bodySchema.parse(request.body);
    const updated = await updateProduct.execute({ id, ...body });
    const expanded = await prisma.product.findUnique({
      where: { id: updated.id },
      include: { supplier: true },
    });
    return reply.send(expanded);
  });

  app.delete("/products/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);
    await deleteProduct.execute({ id });
    return reply.code(204).send();
  });
}
