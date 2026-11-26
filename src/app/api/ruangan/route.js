import { db } from "@/lib/db";
import { gagal, wajibUser } from "@/lib/api";

export async function POST(req) {
  const { error } = await wajibUser(["admin"]);
  if (error) return error;
  try {
    const { nama } = await req.json();
    if (!nama || !String(nama).trim()) return gagal(400, "Nama ruangan wajib diisi.");
    const row = await db.insert("rooms", { nama: String(nama).trim() });
    return Response.json({ room: row });
  } catch (e) {
    return gagal(500, e.message);
  }
}

export async function DELETE(req) {
  const { error } = await wajibUser(["admin"]);
  if (error) return error;
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return gagal(400, "ID ruangan tidak ada.");
    const alat = await db.list("equipment", { room_id: id });
    for (const a of alat) await db.update("equipment", a.id, { room_id: null });
    const jadwal = await db.list("schedules", { room_id: id });
    for (const j of jadwal) await db.update("schedules", j.id, { room_id: null });
    await db.remove("rooms", id);
    return Response.json({ ok: true });
  } catch (e) {
    return gagal(500, e.message);
  }
}
