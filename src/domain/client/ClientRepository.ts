import { Client } from "./Client";

export interface CreateClientData {
  name: string;
  email?: string | null;
  phone: string;
  document?: string | null;
}

export interface UpdateClientData {
  name?: string;
  email?: string | null;
  phone?: string;
  document?: string | null;
}

export interface ClientRepository {
  create(data: CreateClientData): Promise<Client>;
  findById(id: string): Promise<Client | null>;
  findByEmail(email: string): Promise<Client | null>;
  findByDocument(document: string): Promise<Client | null>;
  list(): Promise<Client[]>;
  update(id: string, data: UpdateClientData): Promise<Client>;
  delete(id: string): Promise<void>;
}
