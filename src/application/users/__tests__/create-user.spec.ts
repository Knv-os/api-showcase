import { CreateUser } from "../CreateUser";
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
    const created = new User({
      id: randomUUID(),
      email: data.email,
      name: data.name,
      password_hash: data.password,
      role: data.role ?? "STAFF",
      createdAt: now,
      updatedAt: now,
    });

    it("falha quando senha for curta (< 6)", async () => {
      const repo = new InMemoryUserRepo();
      const usecase = new CreateUser(repo);
      await expect(
        usecase.execute({ email: "x@x.com", name: "X", password: "123" })
      ).rejects.toThrow();
    });

    it("falha quando nome for vazio", async () => {
      const repo = new InMemoryUserRepo();
      const usecase = new CreateUser(repo);
      await expect(
        usecase.execute({ email: "x@x.com", name: "", password: "123456" })
      ).rejects.toThrow();
    });
    this.items.push(created);
    return created;
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

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((u) => u.id !== id);
  }
}

describe("CreateUser", () => {
  it("cria usuário com password hash e role padrão", async () => {
    const repo = new InMemoryUserRepo();
    const usecase = new CreateUser(repo);

    const user = await usecase.execute({
      email: "john@example.com",
      name: "John",
      password: "secret123",
    });

    expect(user).toBeInstanceOf(User);
    expect(user.email).toBe("john@example.com");
    // senha deve ter sido hasheada pelo caso de uso
    const expectedHash = createHash("sha256").update("secret123").digest("hex");
    expect(user.password_hash).toBe(expectedHash);
    expect(user.role).toBe("STAFF");
  });

  it("erro quando e-mail já existe", async () => {
    const repo = new InMemoryUserRepo();
    const usecase = new CreateUser(repo);

    // cria primeiro
    await usecase.execute({
      email: "dupe@example.com",
      name: "A",
      password: "abc12345",
    });

    await expect(
      usecase.execute({
        email: "dupe@example.com",
        name: "B",
        password: "abcdef",
      })
    ).rejects.toThrow("Email already in use");
  });
});
