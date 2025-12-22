import { z } from "zod";
import { Client } from "../../domain/client/Client";
import { ClientRepository } from "../../domain/client/ClientRepository";

const getClientSchema = z.object({ id: z.string().uuid() });

export type GetClientInput = z.infer<typeof getClientSchema>;

export class GetClient {
  constructor(private repo: ClientRepository) {}

  async execute(input: GetClientInput): Promise<Client> {
    const { id } = getClientSchema.parse(input);
    const client = await this.repo.findById(id);
    if (!client) throw new Error("Client not found");
    return client;
  }
}
