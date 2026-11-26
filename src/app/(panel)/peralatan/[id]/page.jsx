import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Badge } from "@/components/ui";
import { IconKembali, IconPensil, IconPeralatan, IconPeringatan } from "@/components/icons";
import TombolHapus from "@/components/TombolHapus";
import { fmtTanggalSingkat } from "@/lib/format";
import { KONDISI, STATUS_LAPORAN, labelOf, toneOf } from "@/lib/constants";

export default async function PeralatanDetailPage({ params }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const alat = await db.get("equipment", id);
  if (!alat) notFound();

  const [rooms, reports, logs, users] = await Promise.all([
    db.list("rooms"),
    db.list("reports", { equipment_id: id }),
    db.list("logs", { equipment_id: id }),
    db.list("users"),
  ]);
  const ruangan = rooms.find((r) => r.id === alat.room_id);
  const namaUser = (uid) => users.find((u) => u.id === uid)?.nama || "Pengguna";
  const bisaUbah = ["admin", "petugas"].includes(user.role);

  return (
    <>
      <p style={{ marginBottom: 14 }}>
        <Link href="/peralatan" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 700, fontSize: 14 }}>
          <IconKembali size={17} /> Semua peralatan
        </Link>
      </p>
      <div className="page-head">
        <div>
          <h1>{alat.nama}</h1>
          <p>
            {alat.kode} · {alat.kategori || "Lainnya"}
          </p>
        </div>
        <div className="page-head-aksi">
          <Badge tone={toneOf(KONDISI, alat.kondisi)}>{labelOf(KONDISI, alat.kondisi)}</Badge>
          {!alat.aktif ? <Badge tone="abu">Nonaktif</Badge> : null}
        </div>
      </div>

      <div className="detail-grid">
        <div className="card">
          {alat.foto_url ? (
            <img src={alat.foto_url} alt={alat.nama} className="detail-foto" />
          ) : (
            <div className="detail-foto-kosong">
              <IconPeralatan size={52} />
            </div>
          )}
          {bisaUbah ? (
            <div className="form-aksi">
              <Link href={`/peralatan/${alat.id}/ubah`} className="btn btn-sekunder">
                <IconPensil size={16} /> Ubah Data
              </Link>
              {user.role === "admin" ? (
                <TombolHapus
                  url={`/api/peralatan?id=${alat.id}`}
                  keSetelah="/peralatan"
                  pesan={`Hapus peralatan ${alat.nama}? Semua laporan kerusakan alat ini ikut terhapus.`}
                />
              ) : null}
            </div>
          ) : null}
          <div className="form-aksi">
            <Link href={`/laporan/baru?alat=${alat.id}`} className="btn btn-block">
              <IconPeringatan size={17} /> Laporkan Kerusakan
            </Link>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <section className="card">
            <div className="card-head">
              <h2>Detail Peralatan</h2>
            </div>
            <dl className="desk-list">
              <dt>Kode inventaris</dt>
              <dd>{alat.kode}</dd>
              <dt>Kategori</dt>
              <dd>{alat.kategori || "-"}</dd>
              <dt>Ruangan</dt>
              <dd>{ruangan ? ruangan.nama : "Tanpa ruangan"}</dd>
              <dt>Kondisi</dt>
              <dd>{labelOf(KONDISI, alat.kondisi)}</dd>
              <dt>Status</dt>
              <dd>{alat.aktif ? "Aktif dipakai" : "Nonaktif"}</dd>
              <dt>Terdaftar sejak</dt>
              <dd>{fmtTanggalSingkat(alat.created_at)}</dd>
              <dt>Catatan</dt>
              <dd>{alat.catatan || "-"}</dd>
            </dl>
          </section>

          <section className="card">
            <div className="card-head">
              <h2>Riwayat Laporan Kerusakan</h2>
            </div>
            {reports.length === 0 ? (
              <p style={{ color: "var(--teks-redup)", fontSize: 14 }}>Belum ada laporan kerusakan untuk alat ini.</p>
            ) : (
              <div className="baris-list">
                {reports.map((r) => (
                  <div className="baris" key={r.id}>
                    <div className="baris-isi">
                      <strong>
                        <Link href={`/laporan/${r.id}`} style={{ color: "inherit" }}>
                          {r.deskripsi.slice(0, 70)}
                          {r.deskripsi.length > 70 ? "..." : ""}
                        </Link>
                      </strong>
                      <small>
                        {namaUser(r.pelapor_id)} · {fmtTanggalSingkat(r.created_at)}
                      </small>
                    </div>
                    <div className="baris-kanan">
                      <Badge tone={toneOf(STATUS_LAPORAN, r.status)}>{labelOf(STATUS_LAPORAN, r.status)}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card">
            <div className="card-head">
              <h2>Riwayat Perawatan</h2>
            </div>
            {logs.length === 0 ? (
              <p style={{ color: "var(--teks-redup)", fontSize: 14 }}>Belum ada catatan perawatan untuk alat ini.</p>
            ) : (
              <div className="baris-list">
                {logs.map((l) => (
                  <div className="baris" key={l.id}>
                    <div className="baris-isi">
                      <strong>{l.jenis}</strong>
                      <small>
                        {l.deskripsi || ""} · oleh {namaUser(l.petugas_id)}
                      </small>
                    </div>
                    <div className="baris-kanan">
                      <small>{fmtTanggalSingkat(l.tanggal)}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
