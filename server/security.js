import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const received = scryptSync(password, salt, expected.length);
  return timingSafeEqual(expected, received);
}

export function createToken(user) {
  const payload = Buffer.from(JSON.stringify({
    id: user.id,
    email: user.email,
    exp: Date.now() + 8 * 60 * 60 * 1000,
  })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readToken(token) {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

  try {
    const user = JSON.parse(Buffer.from(payload, "base64url").toString());
    return user.exp > Date.now() ? user : null;
  } catch {
    return null;
  }
}

function sign(value) {
  return createHmac("sha256", process.env.TOKEN_SECRET).update(value).digest("base64url");
}
