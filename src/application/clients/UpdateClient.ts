import { z } from "zod";
import { Client } from "../../domain/client/Client";
import { ClientRepository } from "../../domain/client/ClientRepository";

const updateClientSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().min(1).optional(),
    email: z.string().trim().toLowerCase().email().nullish(),
    phone: z.string().min(1).optional(),
    document: z.string().trim().nullish(),
  })
  .refine((data) => Object.keys(data).some((k) => k !== "id"), {
    message: "At least one field to update must be provided",
  });

export type UpdateClientInput = z.infer<typeof updateClientSchema>;

export class UpdateClient {
  constructor(private repo: ClientRepository) {}

  async execute(input: UpdateClientInput): Promise<Client> {
    const data = updateClientSchema.parse(input);

    if (data.email) {
      const existing = await this.repo.findByEmail(data.email);
      if (existing && existing.id !== data.id) {
        throw new Error("Client email already in use");
      }
    }

    if (data.document) {
      const existing = await this.repo.findByDocument(data.document);
      if (existing && existing.id !== data.id) {
        throw new Error("Client document already in use");
      }
    }

    const updated = await this.repo.update(data.id, {
      name: data.name,
      email: data.email ?? undefined,
      phone: data.phone,
      document: data.document ?? undefined,
    });

    return updated;
  }
}
