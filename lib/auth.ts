import crypto from "crypto";

type TokenPayload = { email: string; iat: number; exp: number };

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET || "dev-secret-change-me";
  return secret;
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, hash: string) {
  const test = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(test, "hex"), Buffer.from(hash, "hex"));
}

export function signToken(payload: TokenPayload) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", getAuthSecret()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyToken(token: string | undefined): TokenPayload | null {
  if (!token) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const expected = crypto.createHmac("sha256", getAuthSecret()).update(data).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const payload = JSON.parse(Buffer.from(data, "base64url").toString()) as TokenPayload;
  if (Date.now() > payload.exp) return null;
  return payload;
}

export function createSession(email: string, days = 7) {
  const now = Math.floor(Date.now());
  const exp = now + days * 24 * 60 * 60 * 1000;
  return signToken({ email, iat: now, exp });
}