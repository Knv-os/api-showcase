import { UpdateUser } from "../UpdateUser";
import { User } from "../../../domain/user/User";
import {
  UserRepository,
  CreateUserData,
  UpdateUserData,
} from "../../../domain/user/UserRepository";
import { randomUUID, createHash } from "node:crypto";

class InMemoryUserRepo implements UserRepository {
  private items: User[] = [];
  async create(data: CreateUserData): Promise<User> {
    const now = new Date();
    const u = new User({
      id: randomUUID(),
      email: data.email,
      name: data.name,
      password_hash: data.password,
      role: data.role ?? "STAFF",
      createdAt: now,
      updatedAt: now,
    });
    this.items.push(u);
    return u;
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
  async update(id: string, data: UpdateUserData): Promise<User> {
    const idx = this.items.findIndex((u) => u.id === id);
    if (idx < 0) throw new Error("not found");
    const prev = this.items[idx];
    const updated = new User({
      id: prev.id,
      email: data.email ?? prev.email,
      name: data.name ?? prev.name,
      password_hash: data.password ?? prev.password_hash,
      role: data.role ?? prev.role,
      createdAt: prev.createdAt,
      updatedAt: new Date(),
    });
    this.items[idx] = updated;
    return updated;
  }
  async delete(): Promise<void> {
    /* noop */
  }
}

describe("UpdateUser", () => {
  it("atualiza com hash de senha quando fornecida", async () => {
    const repo = new InMemoryUserRepo();
    const u = await repo.create({ email: "a@a.com", name: "A", password: "x" });

    const usecase = new UpdateUser(repo);
    const updated = await usecase.execute({ id: u.id, password: "newPass123" });

    const expectedHash = createHash("sha256")
      .update("newPass123")
      .digest("hex");
    expect(updated.password_hash).toBe(expectedHash);
  });

  it("erro ao atualizar e-mail duplicado", async () => {
    const repo = new InMemoryUserRepo();
    const u1 = await repo.create({
      email: "a@a.com",
      name: "A",
      password: "x",
    });
    const u2 = await repo.create({
      email: "b@b.com",
      name: "B",
      password: "y",
    });

    const usecase = new UpdateUser(repo);
    await expect(
      usecase.execute({ id: u2.id, email: "a@a.com" })
    ).rejects.toThrow("Email already in use");
  });
});
