import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Badge } from "@/components/ui";
import { IconKembali } from "@/components/icons";
import AksiLaporan from "@/components/AksiLaporan";
import { fmtTanggal } from "@/lib/format";
import { KONDISI, STATUS_LAPORAN, labelOf, toneOf } from "@/lib/constants";

export default async function LaporanDetailPage({ params }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const laporan = await db.get("reports", id);
  if (!laporan) notFound();
  if (user.role === "guru" && laporan.pelapor_id !== user.id) notFound();

  const [alat, rooms, users] = await Promise.all([
    db.get("equipment", laporan.equipment_id),
    db.list("rooms"),
    db.list("users"),
  ]);
  const pelapor = users.find((u) => u.id === laporan.pelapor_id);
  const ruangan = alat ? rooms.find((r) => r.id === alat.room_id) : null;

  return (
    <>
      <p style={{ marginBottom: 14 }}>
        <Link href="/laporan" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 700, fontSize: 14 }}>
          <IconKembali size={17} /> Semua laporan
        </Link>
      </p>
      <div className="page-head">
        <div>
          <h1>{alat ? alat.nama : "Laporan Kerusakan"}</h1>
          <p>
            Dilaporkan {fmtTanggal(laporan.created_at)} oleh {pelapor ? pelapor.nama : "Pengguna"}
          </p>
        </div>
        <div className="page-head-aksi">
          <Badge tone={toneOf(STATUS_LAPORAN, laporan.status)}>{labelOf(STATUS_LAPORAN, laporan.status)}</Badge>
        </div>
      </div>

      <div className="detail-grid">
        <div className="card">
          {laporan.foto_url ? (
            <img src={laporan.foto_url} alt="Foto kerusakan" className="detail-foto" />
          ) : (
            <div className="detail-foto-kosong" style={{ padding: 16, textAlign: "center", fontSize: 14, fontWeight: 600 }}>
              Laporan ini tidak disertai foto
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <section className="card">
            <div className="card-head">
              <h2>Isi Laporan</h2>
            </div>
            <dl className="desk-list">
              <dt>Peralatan</dt>
              <dd>
                {alat ? (
                  <Link href={`/peralatan/${alat.id}`}>
                    {alat.nama} ({alat.kode})
                  </Link>
                ) : (
                  "-"
                )}
              </dd>
              <dt>Ruangan</dt>
              <dd>{ruangan ? ruangan.nama : "Tanpa ruangan"}</dd>
              <dt>Kategori</dt>
              <dd>{laporan.kategori || "-"}</dd>
              <dt>Kondisi alat kini</dt>
              <dd>{alat ? labelOf(KONDISI, alat.kondisi) : "-"}</dd>
              <dt>Deskripsi</dt>
              <dd style={{ fontWeight: 500 }}>{laporan.deskripsi}</dd>
              {laporan.catatan_resolusi ? (
                <>
                  <dt>Catatan resolusi</dt>
                  <dd style={{ fontWeight: 500 }}>{laporan.catatan_resolusi}</dd>
                </>
              ) : null}
              {laporan.kondisi_akhir ? (
                <>
                  <dt>Kondisi akhir</dt>
                  <dd>{labelOf(KONDISI, laporan.kondisi_akhir)}</dd>
                </>
              ) : null}
            </dl>
          </section>
          <AksiLaporan laporan={laporan} peran={user.role} />
        </div>
      </div>
    </>
  );
}
