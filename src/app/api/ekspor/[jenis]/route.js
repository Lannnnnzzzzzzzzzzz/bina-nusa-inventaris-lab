import { db } from "@/lib/db";
import { gagal, wajibUser } from "@/lib/api";
import { fmtTanggalSingkat, toCSV } from "@/lib/format";
import { labelOf, KONDISI, STATUS_LAPORAN } from "@/lib/constants";

export async function GET(req, { params }) {
  const { error } = await wajibUser(["admin", "petugas"]);
  if (error) return error;
  const { jenis } = await params;

  const [equipment, rooms, users] = await Promise.all([
    db.list("equipment"),
    db.list("rooms"),
    db.list("users"),
  ]);
  const namaRuangan = (id) => rooms.find((r) => r.id === id)?.nama || "-";
  const namaAlat = (id) => equipment.find((a) => a.id === id)?.nama || "-";
  const namaUser = (id) => users.find((u) => u.id === id)?.nama || "-";

  let csv;
  let namaFile;
  if (jenis === "peralatan") {
    csv = toCSV(
      ["Kode", "Nama", "Kategori", "Ruangan", "Kondisi", "Status", "Catatan"],
      equipment.map((a) => [
        a.kode,
        a.nama,
        a.kategori || "-",
        namaRuangan(a.room_id),
        labelOf(KONDISI, a.kondisi),
        a.aktif ? "Aktif" : "Nonaktif",
        a.catatan || "",
      ])
    );
    namaFile = "peralatan-lab.csv";
  } else if (jenis === "laporan") {
    const reports = await db.list("reports");
    csv = toCSV(
      ["Tanggal", "Peralatan", "Ruangan", "Pelapor", "Kategori", "Deskripsi", "Status", "Catatan Resolusi"],
      reports
        .filter((r) => r.status !== "draft")
        .map((r) => {
          const alat = equipment.find((a) => a.id === r.equipment_id);
          return [
            fmtTanggalSingkat(r.created_at),
            alat ? alat.nama : "-",
            alat ? namaRuangan(alat.room_id) : "-",
            namaUser(r.pelapor_id),
            r.kategori || "-",
            r.deskripsi,
            labelOf(STATUS_LAPORAN, r.status),
            r.catatan_resolusi || "",
          ];
        })
    );
    namaFile = "laporan-kerusakan.csv";
  } else if (jenis === "riwayat") {
    const logs = await db.list("logs");
    csv = toCSV(
      ["Tanggal", "Peralatan", "Jenis", "Deskripsi", "Petugas", "Biaya", "Kondisi Setelah"],
      logs.map((l) => [
        fmtTanggalSingkat(l.tanggal),
        namaAlat(l.equipment_id),
        l.jenis || "-",
        l.deskripsi || "",
        namaUser(l.petugas_id),
        l.biaya === null || l.biaya === undefined ? "" : l.biaya,
        l.kondisi_setelah ? labelOf(KONDISI, l.kondisi_setelah) : "",
      ])
    );
    namaFile = "riwayat-perawatan.csv";
  } else {
    return gagal(404, "Jenis ekspor tidak dikenal.");
  }

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${namaFile}"`,
    },
  });
}
