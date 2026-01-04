import { createHmac } from "node:crypto";
import { TokenProvider, TokenPayload } from "../../domain/auth/TokenProvider";

function base64url(input: Buffer | string): string {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return b
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function signHS256(secret: string, data: string): string {
  return base64url(createHmac("sha256", secret).update(data).digest());
}

function encode(payload: Record<string, any>): string {
  return base64url(Buffer.from(JSON.stringify(payload)));
}

function decode<T = any>(b64: string): T {
  const json = Buffer.from(
    b64.replace(/-/g, "+").replace(/_/g, "/"),
    "base64"
  ).toString();
  return JSON.parse(json) as T;
}

export class JwtTokenProvider implements TokenProvider {
  constructor(private accessSecret: string, private refreshSecret: string) {}

  private createToken(
    subject: string,
    role: string,
    ttlSeconds: number,
    type: "access" | "refresh",
    secret: string
  ): string {
    const header = { alg: "HS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const payload: TokenPayload = {
      sub: subject,
      role,
      iat: now,
      exp: now + ttlSeconds,
      type,
    };
    const h = encode(header);
    const p = encode(payload);
    const sig = signHS256(secret, `${h}.${p}`);
    return `${h}.${p}.${sig}`;
  }

  private verifyToken(
    token: string,
    expectedType: "access" | "refresh",
    secret: string
  ): TokenPayload {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Invalid token");
    const [h, p, s] = parts;
    const sig = signHS256(secret, `${h}.${p}`);
    if (sig !== s) throw new Error("Invalid signature");
    const payload = decode<TokenPayload>(p);
    if (payload.type !== expectedType) throw new Error("Invalid token type");
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) throw new Error("Token expired");
    return payload;
  }

  signAccess(subject: string, role: string, ttlSeconds: number): string {
    return this.createToken(
      subject,
      role,
      ttlSeconds,
      "access",
      this.accessSecret
    );
  }
  signRefresh(subject: string, role: string, ttlSeconds: number): string {
    return this.createToken(
      subject,
      role,
      ttlSeconds,
      "refresh",
      this.refreshSecret
    );
  }
  verifyAccess(token: string): TokenPayload {
    return this.verifyToken(token, "access", this.accessSecret);
  }
  verifyRefresh(token: string): TokenPayload {
    return this.verifyToken(token, "refresh", this.refreshSecret);
  }
}
