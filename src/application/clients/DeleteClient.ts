import { z } from "zod";
import { ClientRepository } from "../../domain/client/ClientRepository";

const deleteClientSchema = z.object({ id: z.string().uuid() });

export type DeleteClientInput = z.infer<typeof deleteClientSchema>;

export class DeleteClient {
  constructor(private repo: ClientRepository) {}

  async execute(input: DeleteClientInput): Promise<void> {
    const { id } = deleteClientSchema.parse(input);
    const existing = await this.repo.findById(id);
    if (!existing) throw new Error("Client not found");
    await this.repo.delete(id);
  }
}
