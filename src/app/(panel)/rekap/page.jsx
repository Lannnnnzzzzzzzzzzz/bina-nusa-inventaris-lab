import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { PageHead, StatCard } from "@/components/ui";
import { IconUnduh } from "@/components/icons";
import TombolCetak from "@/components/TombolCetak";
import { fmtRupiah, fmtTanggal } from "@/lib/format";
import { KONDISI, STATUS_LAPORAN, labelOf } from "@/lib/constants";

export default async function RekapPage() {
  const user = await getCurrentUser();
  if (!["admin", "petugas"].includes(user.role)) redirect("/");
  const [equipment, reports, logs] = await Promise.all([
    db.list("equipment"),
    db.list("reports"),
    db.list("logs"),
  ]);

  const perKondisi = KONDISI.map((k) => ({
    ...k,
    jumlah: equipment.filter((a) => a.aktif && a.kondisi === k.id).length,
  }));
  const perStatus = STATUS_LAPORAN.filter((s) => s.id !== "draft").map((s) => ({
    ...s,
    jumlah: reports.filter((r) => r.status === s.id).length,
  }));
  const totalBiaya = logs.reduce((t, l) => t + (Number(l.biaya) || 0), 0);
  const frekuensi = Object.entries(
    reports
      .filter((r) => r.status !== "draft")
      .reduce((acc, r) => {
        acc[r.equipment_id] = (acc[r.equipment_id] || 0) + 1;
        return acc;
      }, {})
  )
    .map(([alatId, jumlah]) => ({
      alat: equipment.find((a) => a.id === alatId),
      jumlah,
    }))
    .filter((x) => x.alat)
    .sort((a, b) => b.jumlah - a.jumlah)
    .slice(0, 5);

  return (
    <>
      <PageHead judul="Rekap & Ekspor" sub={`Data per ${fmtTanggal(new Date().toISOString())}`}>
        <TombolCetak />
      </PageHead>

      <div className="stat-grid">
        <StatCard angka={equipment.filter((a) => a.aktif).length} label="Peralatan aktif" terisi />
        <StatCard angka={reports.filter((r) => r.status !== "draft").length} label="Total laporan masuk" />
        <StatCard angka={logs.length} label="Total catatan perawatan" />
        <StatCard angka={fmtRupiah(totalBiaya).replace("Rp ", "")} label="Total biaya perawatan (Rp)" />
      </div>

      <div className="grid-2">
        <section className="card">
          <div className="card-head">
            <h2>Peralatan per Kondisi</h2>
          </div>
          <div className="baris-list">
            {perKondisi.map((k) => (
              <div className="baris" key={k.id}>
                <div className="baris-isi">
                  <strong>{k.label}</strong>
                </div>
                <div className="baris-kanan">
                  <strong>{k.jumlah}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="card">
          <div className="card-head">
            <h2>Laporan per Status</h2>
          </div>
          <div className="baris-list">
            {perStatus.map((s) => (
              <div className="baris" key={s.id}>
                <div className="baris-isi">
                  <strong>{s.label}</strong>
                </div>
                <div className="baris-kanan">
                  <strong>{s.jumlah}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="card mt">
        <div className="card-head">
          <h2>Peralatan Paling Sering Dilaporkan</h2>
        </div>
        {frekuensi.length === 0 ? (
          <p style={{ color: "var(--teks-redup)", fontSize: 14 }}>Belum ada laporan kerusakan yang masuk.</p>
        ) : (
          <div className="baris-list">
            {frekuensi.map(({ alat, jumlah }) => (
              <div className="baris" key={alat.id}>
                <div className="baris-isi">
                  <strong>{alat.nama}</strong>
                  <small>
                    {alat.kode} · kondisi kini {labelOf(KONDISI, alat.kondisi)}
                  </small>
                </div>
                <div className="baris-kanan">
                  <strong>{jumlah} laporan</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card mt tanpa-cetak">
        <div className="card-head">
          <h2>Unduh Data (CSV)</h2>
        </div>
        <p style={{ color: "var(--teks-redup)", fontSize: 14, marginBottom: 14 }}>
          Berkas CSV bisa dibuka di Excel atau Google Sheets untuk diolah dan dicetak sebagai laporan.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href="/api/ekspor/peralatan" className="btn btn-sekunder">
            <IconUnduh size={17} /> Peralatan
          </a>
          <a href="/api/ekspor/laporan" className="btn btn-sekunder">
            <IconUnduh size={17} /> Laporan Kerusakan
          </a>
          <a href="/api/ekspor/riwayat" className="btn btn-sekunder">
            <IconUnduh size={17} /> Riwayat Perawatan
          </a>
        </div>
      </section>
    </>
  );
}
