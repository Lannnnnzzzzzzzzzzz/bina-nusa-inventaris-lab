import { db } from "@/lib/db";
import { gagal, wajibUser } from "@/lib/api";
import { tanggalBerikutnya } from "@/lib/format";

export async function POST(req) {
  const { error } = await wajibUser(["admin", "petugas"]);
  if (error) return error;
  try {
    const body = await req.json();
    if (!body.judul || !body.tanggal) return gagal(400, "Judul dan tanggal wajib diisi.");
    const row = await db.insert("schedules", {
      equipment_id: body.equipment_id || null,
      room_id: body.room_id || null,
      judul: String(body.judul).trim(),
      jenis: body.jenis || "Pengecekan berkala",
      tanggal: body.tanggal,
      ulangan: body.ulangan || "tidak",
      status: "terjadwal",
    });
    return Response.json({ schedule: row });
  } catch (e) {
    return gagal(500, e.message);
  }
}

export async function PATCH(req) {
  const { user, error } = await wajibUser(["admin", "petugas"]);
  if (error) return error;
  try {
    const body = await req.json();
    const jadwal = await db.get("schedules", body.id);
    if (!jadwal) return gagal(404, "Jadwal tidak ditemukan.");
    if (body.aksi !== "selesai") return gagal(400, "Aksi tidak dikenal.");
    if (jadwal.status === "selesai") return gagal(400, "Jadwal ini sudah selesai.");

    const row = await db.update("schedules", jadwal.id, { status: "selesai" });
    await db.insert("logs", {
      equipment_id: jadwal.equipment_id,
      schedule_id: jadwal.id,
      petugas_id: user.id,
      tanggal: jadwal.tanggal,
      jenis: jadwal.jenis,
      deskripsi: jadwal.judul,
      biaya: null,
      kondisi_setelah: null,
    });

    let berikutnya = null;
    const tgl = tanggalBerikutnya(jadwal.tanggal, jadwal.ulangan);
    if (tgl) {
      berikutnya = await db.insert("schedules", {
        equipment_id: jadwal.equipment_id,
        room_id: jadwal.room_id,
        judul: jadwal.judul,
        jenis: jadwal.jenis,
        tanggal: tgl,
        ulangan: jadwal.ulangan,
        status: "terjadwal",
      });
    }
    return Response.json({ schedule: row, berikutnya });
  } catch (e) {
    return gagal(500, e.message);
  }
}

export async function DELETE(req) {
  const { error } = await wajibUser(["admin", "petugas"]);
  if (error) return error;
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return gagal(400, "ID jadwal tidak ada.");
    await db.remove("schedules", id);
    return Response.json({ ok: true });
  } catch (e) {
    return gagal(500, e.message);
  }
}
