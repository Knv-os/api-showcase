import { z } from "zod";
import { UserRepository } from "../../domain/user/UserRepository";

const deleteUserSchema = z.object({ id: z.string().uuid() });

export type DeleteUserInput = z.infer<typeof deleteUserSchema>;

export class DeleteUser {
  constructor(private repo: UserRepository) {}

  async execute(input: DeleteUserInput): Promise<void> {
    const { id } = deleteUserSchema.parse(input);
    const existing = await this.repo.findById(id);
    if (!existing) throw new Error("User not found");
    await this.repo.delete(id);
  }
}
