import "dotenv/config";
import Fastify from "fastify";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { usersRoutes } from "./interfaces/http/users.routes";
import { authRoutes } from "./interfaces/http/auth.routes";
import { clientsRoutes } from "./interfaces/http/clients.routes";
import { ordersRoutes } from "./interfaces/http/orders.routes";
import { productsRoutes } from "./interfaces/http/products.routes";
import { suppliersRoutes } from "./interfaces/http/suppliers.routes";
import { measurementsRoutes } from "./interfaces/http/measurements.routes";
import { paymentsRoutes } from "./interfaces/http/payments.routes";

const app = Fastify({
  logger: { level: process.env.LOG_LEVEL || "info" },
});

app.register(async (instance) => {
  instance.addHook("onRequest", async (_req, reply) => {
    reply.header("X-Content-Type-Options", "nosniff");
    reply.header("X-Frame-Options", "SAMEORIGIN");
    reply.header("X-XSS-Protection", "0");
  });

  await usersRoutes(instance);
  await authRoutes(instance);
  await clientsRoutes(instance);
  await ordersRoutes(instance);
  await productsRoutes(instance);
  await suppliersRoutes(instance);
  await measurementsRoutes(instance);
  await paymentsRoutes(instance);
});

app.get("/health", async () => {
  return { status: "ok" };
});

app.setErrorHandler((error: any, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ error: "Validation error", issues: error.issues });
  }

  if (
    error?.message === "Invalid credentials" ||
    error?.message === "Invalid token" ||
    error?.message === "Invalid signature" ||
    error?.message === "Token expired" ||
    error?.message === "Missing refresh token"
  ) {
    return reply.status(401).send({ error: error.message });
  }

  if (error?.message === "User not found") {
    return reply.status(404).send({ error: error.message });
  }

  if (
    error?.message === "Email already in use" ||
    (typeof error?.message === "string" &&
      error.message.includes("At least one field"))
  ) {
    return reply.status(400).send({ error: error.message });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return reply.status(409).send({
        error: "Unique constraint failed",
        target: (error.meta as any)?.target,
      });
    }
    if (error.code === "P2003") {
      return reply.status(409).send({
        error: "Foreign key constraint failed",
        meta: error.meta,
      });
    }
    if (error.code === "P2025") {
      return reply.status(404).send({
        error: "Record not found",
      });
    }
  }

  app.log.error(error);
  return reply.status(500).send({ error: "Internal Server Error" });
});

const PORT = Number(process.env.PORT || 3333);
const HOST = process.env.HOST || "0.0.0.0";

app
  .listen({ port: PORT, host: HOST })
  .then(() => {
    app.log.info(`HTTP server listening on http://${HOST}:${PORT}`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
