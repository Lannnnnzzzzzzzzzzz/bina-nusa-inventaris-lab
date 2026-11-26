import { db, tanpaSandi } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { gagal, wajibUser } from "@/lib/api";

export async function POST(req) {
  const { error } = await wajibUser(["admin"]);
  if (error) return error;
  try {
    const body = await req.json();
    const email = String(body.email || "").toLowerCase().trim();
    if (!body.nama || !email || !body.password)
      return gagal(400, "Nama, email, dan kata sandi wajib diisi.");
    if (String(body.password).length < 8)
      return gagal(400, "Kata sandi minimal 8 karakter.");
    const ada = await db.findUserByEmail(email);
    if (ada) return gagal(409, "Email sudah dipakai akun lain.");
    const row = await db.insert("users", {
      nama: String(body.nama).trim(),
      email,
      password_hash: hashPassword(body.password),
      role: ["admin", "petugas", "guru"].includes(body.role) ? body.role : "guru",
      status: "aktif",
      avatar_url: null,
    });
    return Response.json({ user: tanpaSandi(row) });
  } catch (e) {
    return gagal(500, e.message);
  }
}

export async function PATCH(req) {
  const { user, error } = await wajibUser(["admin"]);
  if (error) return error;
  try {
    const body = await req.json();
    const target = await db.get("users", body.id);
    if (!target) return gagal(404, "Pengguna tidak ditemukan.");
    const patch = {};
    if (body.status && ["aktif", "pending", "nonaktif"].includes(body.status)) {
      if (target.id === user.id && body.status !== "aktif")
        return gagal(400, "Anda tidak bisa menonaktifkan akun sendiri.");
      patch.status = body.status;
    }
    if (body.role && ["admin", "petugas", "guru"].includes(body.role)) patch.role = body.role;
    if (body.password) {
      if (String(body.password).length < 8)
        return gagal(400, "Kata sandi minimal 8 karakter.");
      patch.password_hash = hashPassword(body.password);
    }
    const row = await db.update("users", target.id, patch);
    return Response.json({ user: tanpaSandi(row) });
  } catch (e) {
    return gagal(500, e.message);
  }
}
