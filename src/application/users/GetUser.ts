import { z } from "zod";
import { User } from "../../domain/user/User";
import { UserRepository } from "../../domain/user/UserRepository";

const getUserSchema = z.object({ id: z.string().uuid() });

export type GetUserInput = z.infer<typeof getUserSchema>;

export class GetUser {
  constructor(private repo: UserRepository) {}

  async execute(input: GetUserInput): Promise<User> {
    const { id } = getUserSchema.parse(input);
    const user = await this.repo.findById(id);
    if (!user) throw new Error("User not found");
    return user;
  }
}
