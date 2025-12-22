import { z } from "zod";
import { Client } from "../../domain/client/Client";
import { ClientRepository } from "../../domain/client/ClientRepository";

const createClientSchema = z.object({
  name: z.string().min(1),
  email: z.string().trim().toLowerCase().email().nullish(),
  phone: z.string().min(1),
  document: z.string().trim().nullish(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;

export class CreateClient {
  constructor(private repo: ClientRepository) {}

  async execute(input: CreateClientInput): Promise<Client> {
    const data = createClientSchema.parse(input);

    if (data.email) {
      const existingEmail = await this.repo.findByEmail(data.email);
      if (existingEmail) throw new Error("Client email already in use");
    }

    if (data.document) {
      const existingDoc = await this.repo.findByDocument(data.document);
      if (existingDoc) throw new Error("Client document already in use");
    }

    const client = await this.repo.create({
      name: data.name,
      email: data.email ?? null,
      phone: data.phone,
      document: data.document ?? null,
    });

    return client;
  }
}
