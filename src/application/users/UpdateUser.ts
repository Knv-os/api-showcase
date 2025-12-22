import { z } from "zod";
import { User } from "../../domain/user/User";
import { UserRepository } from "../../domain/user/UserRepository";
import { createHash } from "node:crypto";

const updateUserSchema = z
  .object({
    id: z.string().uuid(),
    email: z.string().email().optional(),
    name: z.string().min(1).optional(),
    password: z.string().min(6).optional(),
    role: z.string().optional(),
  })
  .refine((data) => Object.keys(data).some((k) => k !== "id"), {
    message: "At least one field to update must be provided",
  });

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export class UpdateUser {
  constructor(private repo: UserRepository) {}

  async execute(input: UpdateUserInput): Promise<User> {
    const data = updateUserSchema.parse(input);

    if (data.email) {
      const existing = await this.repo.findByEmail(data.email);
      if (existing && existing.id !== data.id) {
        throw new Error("Email already in use");
      }
    }

    const passwordHash = data.password
      ? createHash("sha256").update(data.password).digest("hex")
      : undefined;

    const updated = await this.repo.update(data.id, {
      email: data.email,
      name: data.name,
      password: passwordHash,
      role: data.role,
    });

    return updated;
  }
}
