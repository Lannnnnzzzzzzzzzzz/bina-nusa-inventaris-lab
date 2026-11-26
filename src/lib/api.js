import { getCurrentUser } from "./auth";

export function gagal(status, pesan) {
  return Response.json({ error: pesan }, { status });
}

export async function wajibUser(roles) {
  const user = await getCurrentUser();
  if (!user) return { error: gagal(401, "Sesi berakhir. Silakan masuk lagi.") };
  if (roles && !roles.includes(user.role))
    return { error: gagal(403, "Anda tidak punya akses untuk tindakan ini.") };
  return { user };
}

export function teks(form, nama) {
  const v = form.get(nama);
  return typeof v === "string" ? v.trim() : "";
}
