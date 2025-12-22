import { ListUsers } from "../ListUsers";
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
  async findById(): Promise<User | null> {
    return null;
  }
  async findByEmail(): Promise<User | null> {
    return null;
  }
  async list(): Promise<User[]> {
    return [...this.items];
  }
  async update(id: string, data: UpdateUserData): Promise<User> {
    throw new Error("not used");
  }
  async delete(id: string): Promise<void> {
    throw new Error("not used");
  }
}

describe("ListUsers", () => {
  it("lista usuários do repositório", async () => {
    const repo = new InMemoryUserRepo();
    await repo.create({ email: "a@a.com", name: "A", password: "x" });
    await repo.create({ email: "b@b.com", name: "B", password: "y" });

    const usecase = new ListUsers(repo);
    const list = await usecase.execute();

    expect(list).toHaveLength(2);
    expect(list[0]).toBeInstanceOf(User);
  });
});
