import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { gagal } from "@/lib/api";

export async function POST(req) {
  try {
    const { nama, email, password } = await req.json();
    const emailBersih = String(email || "").toLowerCase().trim();
    if (!nama || !emailBersih || !password)
      return gagal(400, "Nama, email, dan kata sandi wajib diisi.");
    if (String(password).length < 8)
      return gagal(400, "Kata sandi minimal 8 karakter.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailBersih))
      return gagal(400, "Format email tidak valid.");
    const ada = await db.findUserByEmail(emailBersih);
    if (ada) return gagal(409, "Email sudah terdaftar. Silakan masuk.");
    await db.insert("users", {
      nama: String(nama).trim(),
      email: emailBersih,
      password_hash: hashPassword(password),
      role: "guru",
      status: "pending",
      avatar_url: null,
    });
    return Response.json({
      ok: true,
      pesan: "Pendaftaran terkirim. Akun aktif setelah diverifikasi admin.",
    });
  } catch (e) {
    return gagal(500, "Terjadi kesalahan di server: " + e.message);
  }
}
