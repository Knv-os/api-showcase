export type TokenPayload = {
  sub: string;
  role: string;
  iat: number;
  exp: number;
  type: "access" | "refresh";
};

export interface TokenProvider {
  signAccess(subject: string, role: string, ttlSeconds: number): string;
  signRefresh(subject: string, role: string, ttlSeconds: number): string;
  verifyAccess(token: string): TokenPayload;
  verifyRefresh(token: string): TokenPayload;
}
