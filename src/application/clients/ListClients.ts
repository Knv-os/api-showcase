import { Client } from "../../domain/client/Client";
import { ClientRepository } from "../../domain/client/ClientRepository";

export class ListClients {
  constructor(private repo: ClientRepository) {}

  async execute(): Promise<Client[]> {
    return this.repo.list();
  }
}
