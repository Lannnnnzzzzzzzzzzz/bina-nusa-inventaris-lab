import { db, tanpaSandi } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { simpanFoto } from "@/lib/photos";
import { gagal, teks, wajibUser } from "@/lib/api";

export async function PATCH(req) {
  const { user, error } = await wajibUser();
  if (error) return error;
  try {
    const form = await req.formData();
    const patch = {};
    const nama = teks(form, "nama");
    if (nama) patch.nama = nama;
    const foto = form.get("foto");
    if (foto && foto.size > 0) patch.avatar_url = await simpanFoto(foto, "avatar");

    const sandiBaru = teks(form, "password_baru");
    if (sandiBaru) {
      const lengkap = await db.get("users", user.id);
      if (!verifyPassword(teks(form, "password_lama"), lengkap.password_hash))
        return gagal(400, "Kata sandi lama salah.");
      if (sandiBaru.length < 8) return gagal(400, "Kata sandi baru minimal 8 karakter.");
      patch.password_hash = hashPassword(sandiBaru);
    }
    const row = await db.update("users", user.id, patch);
    return Response.json({ user: tanpaSandi(row) });
  } catch (e) {
    return gagal(500, e.message);
  }
}
