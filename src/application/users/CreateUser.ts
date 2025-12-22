import { z } from "zod";
import { randomUUID, createHash } from "node:crypto";
import { User } from "../../domain/user/User";
import { UserRepository } from "../../domain/user/UserRepository";

const createUserSchema = z.object({
  email: z.string().trim().toLowerCase(),
  name: z.string().min(1),
  password: z.string().min(6),
  role: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export class CreateUser {
  constructor(private repo: UserRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    const data = createUserSchema.parse(input);

    const existing = await this.repo.findByEmail(data.email);
    if (existing) throw new Error("Email already in use");

    const password_hash = createHash("sha256")
      .update(data.password)
      .digest("hex");

    const user = await this.repo.create({
      email: data.email,
      name: data.name,
      password: password_hash,
      role: data.role ?? "STAFF",
    });

    return user;
  }
}
