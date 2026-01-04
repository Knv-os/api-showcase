export interface Hasher {
  hash(plain: string): Promise<string> | string;
  compare(plain: string, hashed: string): Promise<boolean> | boolean;
}
