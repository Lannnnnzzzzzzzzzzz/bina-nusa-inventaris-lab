import { db } from "@/lib/db";
import { gagal, wajibUser } from "@/lib/api";
import { hariIni } from "@/lib/format";

export async function POST(req) {
  const { user, error } = await wajibUser(["admin", "petugas"]);
  if (error) return error;
  try {
    const body = await req.json();
    if (!body.equipment_id) return gagal(400, "Pilih peralatan yang dirawat.");
    if (!body.deskripsi) return gagal(400, "Deskripsi perawatan wajib diisi.");
    const row = await db.insert("logs", {
      equipment_id: body.equipment_id,
      schedule_id: null,
      petugas_id: user.id,
      tanggal: body.tanggal || hariIni(),
      jenis: body.jenis || "Pengecekan berkala",
      deskripsi: String(body.deskripsi).trim(),
      biaya: body.biaya === "" || body.biaya === undefined ? null : Number(body.biaya),
      kondisi_setelah: body.kondisi_setelah || null,
    });
    if (body.kondisi_setelah) {
      await db.update("equipment", body.equipment_id, { kondisi: body.kondisi_setelah });
    }
    return Response.json({ log: row });
  } catch (e) {
    return gagal(500, e.message);
  }
}
