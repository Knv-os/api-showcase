import { GetUser } from "../GetUser";
import { User } from "../../../domain/user/User";
import {
  UserRepository,
  CreateUserData,
  UpdateUserData,
} from "../../../domain/user/UserRepository";
import { randomUUID } from "node:crypto";

class InMemoryUserRepo implements UserRepository {
  private items: User[] = [];

  async create(data: CreateUserData): Promise<User> {
    const now = new Date();
    const user = new User({
      id: randomUUID(),
      email: data.email,
      name: data.name,
      password_hash: data.password,
      role: data.role ?? "STAFF",
      createdAt: now,
      updatedAt: now,
    });
    this.items.push(user);
    return user;
  }
  async findById(id: string): Promise<User | null> {
    return this.items.find((u) => u.id === id) ?? null;
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((u) => u.email === email) ?? null;
  }
  async list(): Promise<User[]> {
    return [...this.items];
  }
  async update(): Promise<User> {
    throw new Error("not used");
  }
  async delete(): Promise<void> {
    throw new Error("not used");
  }
}

describe("GetUser", () => {
  it("retorna usuário existente", async () => {
    const repo = new InMemoryUserRepo();
    const created = await repo.create({
      email: "a@a.com",
      name: "A",
      password: "x",
    });

    const usecase = new GetUser(repo);
    const got = await usecase.execute({ id: created.id });

    expect(got.id).toBe(created.id);
  });

  it("lança erro quando não encontrado", async () => {
    const repo = new InMemoryUserRepo();
    const usecase = new GetUser(repo);
    await expect(usecase.execute({ id: randomUUID() })).rejects.toThrow(
      "User not found"
    );
  });
});
