import { cookies } from "next/headers";
import { db, tanpaSandi } from "@/lib/db";
import {
  bootstrapAdmin,
  buatTokenSesi,
  catatGagalLogin,
  kenaRateLimit,
  opsiCookieSesi,
  resetGagalLogin,
  verifyPassword,
  COOKIE_SESI,
} from "@/lib/auth";
import { gagal } from "@/lib/api";

export async function POST(req) {
  try {
    await bootstrapAdmin();
    const ip = req.headers.get("x-forwarded-for") || "lokal";
    if (kenaRateLimit(ip))
      return gagal(429, "Terlalu banyak percobaan masuk. Coba lagi dalam 15 menit.");

    const { email, password } = await req.json();
    const user = await db.findUserByEmail(email);
    if (!user || !verifyPassword(password || "", user.password_hash)) {
      catatGagalLogin(ip);
      return gagal(401, "Email atau kata sandi salah.");
    }
    if (user.status === "pending")
      return gagal(403, "Akun Anda masih menunggu verifikasi admin.");
    if (user.status !== "aktif")
      return gagal(403, "Akun Anda sedang dinonaktifkan. Hubungi admin.");

    resetGagalLogin(ip);
    const jar = await cookies();
    jar.set(COOKIE_SESI, buatTokenSesi(user), opsiCookieSesi());
    return Response.json({ user: tanpaSandi(user) });
  } catch (e) {
    return gagal(500, "Terjadi kesalahan di server: " + e.message);
  }
}
