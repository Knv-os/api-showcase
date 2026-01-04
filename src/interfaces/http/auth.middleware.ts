import { FastifyReply, FastifyRequest } from "fastify";
import { TokenProvider } from "../../domain/auth/TokenProvider";

function parseCookies(header: string | undefined) {
  const h = header ?? "";
  return Object.fromEntries(
    h
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
}

export function ensureAuth(tokens: TokenProvider) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const cookies = parseCookies(
      request.headers["cookie"] as string | undefined
    );
    const token = cookies["access_token"];
    if (!token) {
      return reply.status(401).send({ error: "Invalid token" });
    }
    const payload = tokens.verifyAccess(token);
    (request as any).auth = payload;
  };
}
