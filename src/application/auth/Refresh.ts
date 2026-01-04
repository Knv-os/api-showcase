import { TokenProvider } from "../../domain/auth/TokenProvider";

export class Refresh {
  constructor(
    private tokens: TokenProvider,
    private accessTtlSec: number,
    private refreshTtlSec: number
  ) {}

  execute(oldRefreshToken: string) {
    const payload = this.tokens.verifyRefresh(oldRefreshToken);
    const newAccess = this.tokens.signAccess(
      payload.sub,
      payload.role,
      this.accessTtlSec
    );
    const newRefresh = this.tokens.signRefresh(
      payload.sub,
      payload.role,
      this.refreshTtlSec
    );
    return {
      accessToken: newAccess,
      refreshToken: newRefresh,
      userId: payload.sub,
      role: payload.role,
    };
  }
}
