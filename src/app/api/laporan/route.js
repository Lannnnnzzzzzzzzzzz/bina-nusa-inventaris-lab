import { db } from "@/lib/db";
import { simpanFoto } from "@/lib/photos";
import { gagal, teks, wajibUser } from "@/lib/api";
import { hariIni } from "@/lib/format";

export async function POST(req) {
  const { user, error } = await wajibUser();
  if (error) return error;
  try {
    const form = await req.formData();
    const equipment_id = teks(form, "equipment_id");
    const deskripsi = teks(form, "deskripsi");
    if (!equipment_id) return gagal(400, "Pilih peralatan yang dilaporkan.");
    if (!deskripsi) return gagal(400, "Deskripsi kerusakan wajib diisi.");
    const alat = await db.get("equipment", equipment_id);
    if (!alat) return gagal(404, "Peralatan tidak ditemukan.");
    let foto_url = null;
    const foto = form.get("foto");
    if (foto && foto.size > 0) foto_url = await simpanFoto(foto, "kerusakan");
    const row = await db.insert("reports", {
      equipment_id,
      pelapor_id: user.id,
      kategori: teks(form, "kategori") || "Lainnya",
      deskripsi,
      foto_url,
      status: teks(form, "status") === "draft" ? "draft" : "baru",
      catatan_resolusi: null,
      kondisi_akhir: null,
    });
    return Response.json({ report: row });
  } catch (e) {
    return gagal(500, e.message);
  }
}

export async function PATCH(req) {
  const { user, error } = await wajibUser();
  if (error) return error;
  try {
    const body = await req.json();
    const laporan = await db.get("reports", body.id);
    if (!laporan) return gagal(404, "Laporan tidak ditemukan.");
    const statusBaru = body.status;

    // Pelapor hanya boleh mengirim draft miliknya sendiri
    if (statusBaru === "baru" && laporan.status === "draft") {
      if (laporan.pelapor_id !== user.id && user.role === "guru")
        return gagal(403, "Draft ini bukan milik Anda.");
      const row = await db.update("reports", laporan.id, { status: "baru" });
      return Response.json({ report: row });
    }

    // Perubahan status proses hanya untuk petugas dan admin
    if (!["petugas", "admin"].includes(user.role))
      return gagal(403, "Hanya petugas atau admin yang memproses laporan.");

    const patch = { status: statusBaru };
    if (body.catatan_resolusi !== undefined)
      patch.catatan_resolusi = body.catatan_resolusi || null;
    if (body.kondisi_akhir !== undefined) patch.kondisi_akhir = body.kondisi_akhir || null;

    const alat = await db.get("equipment", laporan.equipment_id);

    if (statusBaru === "diproses" && alat) {
      await db.update("equipment", alat.id, { kondisi: "dalam_perbaikan" });
    }

    if (statusBaru === "selesai") {
      const kondisiAkhir = body.kondisi_akhir || "baik";
      patch.kondisi_akhir = kondisiAkhir;
      if (alat) await db.update("equipment", alat.id, { kondisi: kondisiAkhir });
      await db.insert("logs", {
        equipment_id: laporan.equipment_id,
        schedule_id: null,
        petugas_id: user.id,
        tanggal: hariIni(),
        jenis: "Servis",
        deskripsi: `Perbaikan dari laporan kerusakan: ${laporan.deskripsi}`,
        biaya: null,
        kondisi_setelah: kondisiAkhir,
      });
    }

    if (statusBaru === "ditolak" && alat && alat.kondisi === "dalam_perbaikan") {
      const lain = (await db.list("reports", { equipment_id: alat.id })).filter(
        (r) => r.id !== laporan.id && r.status === "diproses"
      );
      if (lain.length === 0) await db.update("equipment", alat.id, { kondisi: "baik" });
    }

    const row = await db.update("reports", laporan.id, patch);
    return Response.json({ report: row });
  } catch (e) {
    return gagal(500, e.message);
  }
}

export async function DELETE(req) {
  const { user, error } = await wajibUser();
  if (error) return error;
  try {
    const id = new URL(req.url).searchParams.get("id");
    const laporan = await db.get("reports", id);
    if (!laporan) return gagal(404, "Laporan tidak ditemukan.");
    if (laporan.status !== "draft") return gagal(400, "Hanya draft yang bisa dihapus.");
    if (laporan.pelapor_id !== user.id && user.role !== "admin")
      return gagal(403, "Draft ini bukan milik Anda.");
    await db.remove("reports", id);
    return Response.json({ ok: true });
  } catch (e) {
    return gagal(500, e.message);
  }
}
