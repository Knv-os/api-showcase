import { DeleteUser } from "../DeleteUser";
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
    throw new Error("not used");
  }
  async delete(id: string): Promise<void> {
    this.items = this.items.filter((u) => u.id !== id);
  }
}

describe("DeleteUser", () => {
  it("deleta usuário existente", async () => {
    const repo = new InMemoryUserRepo();
    const u = await repo.create({ email: "a@a.com", name: "A", password: "x" });
    const usecase = new DeleteUser(repo);

    await usecase.execute({ id: u.id });

    expect(await repo.findById(u.id)).toBeNull();
  });

  it("erro ao tentar deletar usuário inexistente", async () => {
    const repo = new InMemoryUserRepo();
    const usecase = new DeleteUser(repo);
    await expect(usecase.execute({ id: randomUUID() })).rejects.toThrow(
      "User not found"
    );
  });
});
