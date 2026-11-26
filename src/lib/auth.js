import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { db, tanpaSandi } from "./db";

export const COOKIE_SESI = "lab_session";
const SECRET = process.env.LAB_SESSION_SECRET || "lab-binanusa-dev-secret-ganti-di-produksi";
const UMUR_SESI = 24 * 60 * 60 * 1000;

export function hashPassword(pw) {
  const salt = randomBytes(16);
  const hash = scryptSync(String(pw), salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt:16384:8:1:${salt.toString("base64")}:${hash.toString("base64")}`;
}

export function verifyPassword(pw, stored) {
  try {
    const [, n, r, p, saltB64, hashB64] = String(stored).split(":");
    const salt = Buffer.from(saltB64, "base64");
    const target = Buffer.from(hashB64, "base64");
    const hasil = scryptSync(String(pw), salt, target.length, {
      N: Number(n),
      r: Number(r),
      p: Number(p),
    });
    return timingSafeEqual(hasil, target);
  } catch {
    return false;
  }
}

function tanda(payloadB64) {
  return createHmac("sha256", SECRET).update(payloadB64).digest("base64url");
}

export function buatTokenSesi(user) {
  const payload = { uid: user.id, exp: Date.now() + UMUR_SESI };
  const b64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${b64}.${tanda(b64)}`;
}

export function bacaTokenSesi(token) {
  try {
    const [b64, sig] = String(token || "").split(".");
    if (!b64 || !sig) return null;
    const a = Buffer.from(sig);
    const b = Buffer.from(tanda(b64));
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const payload = JSON.parse(Buffer.from(b64, "base64url").toString("utf8"));
    if (!payload.uid || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const jar = await cookies();
  const payload = bacaTokenSesi(jar.get(COOKIE_SESI)?.value);
  if (!payload) return null;
  const user = await db.get("users", payload.uid);
  if (!user || user.status !== "aktif") return null;
  return tanpaSandi(user);
}

export function opsiCookieSesi() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: UMUR_SESI / 1000,
  };
}

export async function bootstrapAdmin() {
  const semua = await db.list("users");
  if (semua.length > 0) return;
  const email = (process.env.LAB_ADMIN_EMAIL || "").toLowerCase().trim();
  const pw = process.env.LAB_ADMIN_PASSWORD || "";
  if (!email || !pw) return;
  try {
    await db.insert("users", {
      nama: process.env.LAB_ADMIN_NAMA || "Admin Lab",
      email,
      password_hash: hashPassword(pw),
      role: "admin",
      status: "aktif",
      avatar_url: null,
    });
  } catch (error) {
    // Parallel page/API requests may both observe an empty users table.
    if (await db.findUserByEmail(email)) return;
    throw error;
  }
}

const kunciRate = new Map();
export function kenaRateLimit(ip) {
  const now = Date.now();
  const entri = kunciRate.get(ip) || { gagal: 0, kunciSampai: 0 };
  if (entri.kunciSampai > now) return true;
  return false;
}
export function catatGagalLogin(ip) {
  const now = Date.now();
  const entri = kunciRate.get(ip) || { gagal: 0, kunciSampai: 0 };
  entri.gagal += 1;
  if (entri.gagal >= 5) {
    entri.kunciSampai = now + 15 * 60 * 1000;
    entri.gagal = 0;
  }
  kunciRate.set(ip, entri);
}
export function resetGagalLogin(ip) {
  kunciRate.delete(ip);
}
