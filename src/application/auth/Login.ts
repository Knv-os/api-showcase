import { z } from "zod";
import { UserRepository } from "../../domain/user/UserRepository";
import { Hasher } from "../../domain/auth/Hasher";
import { TokenProvider } from "../../domain/auth/TokenProvider";

const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;

export type LoginOutput = {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; name: string; role: string };
};

export class Login {
  constructor(
    private repo: UserRepository,
    private hasher: Hasher,
    private tokens: TokenProvider,
    private accessTtlSec: number,
    private refreshTtlSec: number
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const data = loginSchema.parse(input);
    const user = await this.repo.findByEmail(data.email);
    if (!user) throw new Error("Invalid credentials");

    const ok = await this.hasher.compare(data.password, user.password_hash);
    if (!ok) throw new Error("Invalid credentials");

    const accessToken = this.tokens.signAccess(
      user.id,
      user.role,
      this.accessTtlSec
    );
    const refreshToken = this.tokens.signRefresh(
      user.id,
      user.role,
      this.refreshTtlSec
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
