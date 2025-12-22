import { User } from "../../domain/user/User";
import { UserRepository } from "../../domain/user/UserRepository";

export class ListUsers {
  constructor(private repo: UserRepository) {}

  async execute(): Promise<User[]> {
    return this.repo.list();
  }
}
