import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Badge, EmptyState, PageHead } from "@/components/ui";
import { IconKunci } from "@/components/icons";
import { fmtRupiah, fmtTanggalSingkat } from "@/lib/format";
import { KONDISI, labelOf, toneOf } from "@/lib/constants";

export default async function RiwayatPage() {
  const user = await getCurrentUser();
  const [logs, equipment, users] = await Promise.all([
    db.list("logs"),
    db.list("equipment"),
    db.list("users"),
  ]);
  const namaAlat = (id) => equipment.find((a) => a.id === id)?.nama || "Peralatan";
  const namaUser = (id) => users.find((u) => u.id === id)?.nama || "Petugas";
  const bisaCatat = ["admin", "petugas"].includes(user.role);
  const terurut = [...logs].sort((a, b) => String(b.tanggal).localeCompare(String(a.tanggal)));

  return (
    <>
      <PageHead judul="Riwayat Perawatan" sub={`${logs.length} catatan perawatan dan perbaikan tercatat`}>
        {bisaCatat ? (
          <Link href="/riwayat/catat" className="btn">
            <IconKunci size={18} /> Catat Perawatan
          </Link>
        ) : null}
      </PageHead>
      {terurut.length === 0 ? (
        <EmptyState
          ikon={<IconKunci size={26} />}
          judul="Belum ada riwayat perawatan"
          teks="Riwayat terisi otomatis saat jadwal ditandai selesai atau laporan kerusakan diselesaikan, dan bisa ditambah manual lewat tombol Catat Perawatan."
        />
      ) : (
        <div className="card">
          <div className="baris-list">
            {terurut.map((l) => (
              <div className="baris" key={l.id}>
                <div className="baris-isi">
                  <strong>
                    {l.jenis} ·{" "}
                    <Link href={`/peralatan/${l.equipment_id}`} style={{ color: "inherit" }}>
                      {namaAlat(l.equipment_id)}
                    </Link>
                  </strong>
                  <small>
                    {l.deskripsi || ""} · oleh {namaUser(l.petugas_id)}
                    {l.biaya ? ` · ${fmtRupiah(l.biaya)}` : ""}
                  </small>
                </div>
                <div className="baris-kanan">
                  <small>{fmtTanggalSingkat(l.tanggal)}</small>
                  {l.kondisi_setelah ? (
                    <Badge tone={toneOf(KONDISI, l.kondisi_setelah)}>
                      {labelOf(KONDISI, l.kondisi_setelah)}
                    </Badge>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
