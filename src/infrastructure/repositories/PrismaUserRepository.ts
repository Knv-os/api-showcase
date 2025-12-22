import { prisma } from "../prisma/client";
import { User } from "../../domain/user/User";
import {
  CreateUserData,
  UpdateUserData,
  UserRepository,
} from "../../domain/user/UserRepository";
import { randomUUID } from "node:crypto";

export class PrismaUserRepository implements UserRepository {
  async create(data: CreateUserData): Promise<User> {
    const created = await prisma.user.create({
      data: {
        id: randomUUID(),
        email: data.email,
        name: data.name,
        password_hash: data.password,
        role: data.role ?? "STAFF",
      },
    });
    return new User({ ...created });
  }

  async findById(id: string): Promise<User | null> {
    const found = await prisma.user.findUnique({ where: { id } });
    return found ? new User({ ...found }) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await prisma.user.findUnique({ where: { email } });
    return found ? new User({ ...found }) : null;
  }

  async list(): Promise<User[]> {
    const rows = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map((r) => new User({ ...r }));
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    const updated = await prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        name: data.name,
        password_hash: data.password,
        role: data.role,
      },
    });
    return new User({ ...updated });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
