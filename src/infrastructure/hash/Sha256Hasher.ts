import { createHash } from "node:crypto";
import { Hasher } from "../../domain/auth/Hasher";

export class Sha256Hasher implements Hasher {
  hash(plain: string): string {
    return createHash("sha256").update(plain).digest("hex");
  }
  compare(plain: string, hashed: string): boolean {
    const calc = this.hash(plain);
    return calc === hashed;
  }
}
