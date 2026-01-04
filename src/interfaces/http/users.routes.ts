import { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";
import { CreateUser } from "../../application/users/CreateUser";
import { GetUser } from "../../application/users/GetUser";
import { ListUsers } from "../../application/users/ListUsers";
import { UpdateUser } from "../../application/users/UpdateUser";
import { DeleteUser } from "../../application/users/DeleteUser";
import { ensureAuth } from "./auth.middleware";
import { JwtTokenProvider } from "../../infrastructure/tokens/JwtTokenProvider";

export async function usersRoutes(app: FastifyInstance) {
  const repo = new PrismaUserRepository();
  const createUser = new CreateUser(repo);
  const getUser = new GetUser(repo);
  const listUsers = new ListUsers(repo);
  const updateUser = new UpdateUser(repo);
  const deleteUser = new DeleteUser(repo);

  const accessSecret = process.env.JWT_ACCESS_SECRET || "dev-access-secret";
  const refreshSecret = process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";
  const tokens = new JwtTokenProvider(accessSecret, refreshSecret);
  const auth = ensureAuth(tokens);

  app.post("/users", async (request, reply) => {
    const bodySchema = z.object({
      email: z.string().email(),
      name: z.string().min(1),
      password: z.string().min(6),
      role: z.string().optional(),
    });

    const body = bodySchema.parse(request.body);
    const user = await createUser.execute(body);

    return reply.code(201).send({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  });

  app.get("/users", { onRequest: auth }, async (_request, reply) => {
    const users = await listUsers.execute();
    return reply.send(
      users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      }))
    );
  });

  app.get("/users/:id", { onRequest: auth }, async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);
    const user = await getUser.execute({ id });
    return reply.send({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  });

  app.put("/users/:id", { onRequest: auth }, async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const bodySchema = z.object({
      email: z.string().email().optional(),
      name: z.string().min(1).optional(),
      password: z.string().min(6).optional(),
      role: z.string().optional(),
    });

    const { id } = paramsSchema.parse(request.params);
    const body = bodySchema.parse(request.body);

    const user = await updateUser.execute({ id, ...body });
    return reply.send({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  });

  app.delete("/users/:id", { onRequest: auth }, async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);
    await deleteUser.execute({ id });
    return reply.code(204).send();
  });
}
