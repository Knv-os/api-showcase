import "dotenv/config";
import Fastify from "fastify";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { usersRoutes } from "./interfaces/http/users.routes";
import { clientsRoutes } from "./interfaces/http/clients.routes";

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
  await clientsRoutes(instance);
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
    error?.message === "User not found" ||
    error?.message === "Client not found"
  ) {
    return reply.status(404).send({ error: error.message });
  }

  if (
    error?.message === "Email already in use" ||
    error?.message === "Client email already in use" ||
    error?.message === "Client document already in use" ||
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
