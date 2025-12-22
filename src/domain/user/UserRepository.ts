import { User } from "./User";

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  role?: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
  password?: string;
  role?: string;
}

export interface UserRepository {
  create(data: CreateUserData): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  list(): Promise<User[]>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
}
