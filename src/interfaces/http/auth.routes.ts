import { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";
import { Sha256Hasher } from "../../infrastructure/hash/Sha256Hasher";
import { JwtTokenProvider } from "../../infrastructure/tokens/JwtTokenProvider";
import { Login } from "../../application/auth/Login";
import { Refresh } from "../../application/auth/Refresh";

function makeCookie(name: string, value: string, maxAgeSec: number) {
  const isProd = process.env.NODE_ENV === "production";
  const attrs = [
    `${name}=${value}`,
    `HttpOnly`,
    `Path=/`,
    `Max-Age=${maxAgeSec}`,
    `SameSite=Lax`,
  ];
  if (isProd) attrs.push(`Secure`);
  return attrs.join("; ");
}

export async function authRoutes(app: FastifyInstance) {
  const userRepo = new PrismaUserRepository();
  const hasher = new Sha256Hasher();
  const accessTtlSec = Number(process.env.ACCESS_TOKEN_TTL ?? 60 * 15);
  const refreshTtlSec = Number(
    process.env.REFRESH_TOKEN_TTL ?? 60 * 60 * 24 * 7
  );
  const accessSecret = process.env.JWT_ACCESS_SECRET || "dev-access-secret";
  const refreshSecret = process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";
  const tokens = new JwtTokenProvider(accessSecret, refreshSecret);

  const login = new Login(
    userRepo,
    hasher,
    tokens,
    accessTtlSec,
    refreshTtlSec
  );
  const refresh = new Refresh(tokens, accessTtlSec, refreshTtlSec);

  app.post("/sessions", async (request, reply) => {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    });
    const body = bodySchema.parse(request.body);
    const result = await login.execute(body);

    const accessCookie = makeCookie(
      "access_token",
      result.accessToken,
      accessTtlSec
    );
    const refreshCookie = makeCookie(
      "refresh_token",
      result.refreshToken,
      refreshTtlSec
    );
    reply.header("set-cookie", [accessCookie, refreshCookie]);

    return reply.code(200).send({ user: result.user });
  });

  app.post("/sessions/refresh", async (request, reply) => {
    const cookiesHeader = request.headers["cookie"] ?? "";
    const cookies = Object.fromEntries(
      (cookiesHeader as string)
        .split(";")
        .map((c) => c.trim())
        .filter(Boolean)
        .map((c) => {
          const idx = c.indexOf("=");
          if (idx < 0) return [c, ""] as [string, string];
          return [
            decodeURIComponent(c.slice(0, idx)),
            decodeURIComponent(c.slice(idx + 1)),
          ] as [string, string];
        })
    );

    const token = cookies["refresh_token"];
    if (!token) {
      return reply.status(401).send({ error: "Missing refresh token" });
    }

    const res = refresh.execute(token);
    const accessCookie = makeCookie(
      "access_token",
      res.accessToken,
      accessTtlSec
    );
    const refreshCookie = makeCookie(
      "refresh_token",
      res.refreshToken,
      refreshTtlSec
    );
    reply.header("set-cookie", [accessCookie, refreshCookie]);

    return reply.status(200).send({ ok: true });
  });

  app.get("/me", async (request, reply) => {
    const cookiesHeader = request.headers["cookie"] ?? "";
    const cookies = Object.fromEntries(
      (cookiesHeader as string)
        .split(";")
        .map((c) => c.trim())
        .filter(Boolean)
        .map((c) => {
          const idx = c.indexOf("=");
          if (idx < 0) return [c, ""] as [string, string];
          return [
            decodeURIComponent(c.slice(0, idx)),
            decodeURIComponent(c.slice(idx + 1)),
          ] as [string, string];
        })
    );

    const token = cookies["access_token"];
    if (!token) {
      return reply.status(401).send({ error: "Invalid token" });
    }

    const payload = tokens.verifyAccess(token);
    const user = await userRepo.findById(payload.sub);
    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }
    return reply.send({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  });

  app.post("/sessions/logout", async (_request, reply) => {
    const clearAccess = makeCookie("access_token", "", 0);
    const clearRefresh = makeCookie("refresh_token", "", 0);
    reply.header("set-cookie", [clearAccess, clearRefresh]);
    return reply.status(204).send();
  });
}
