import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Badge, PageHead, StatCard } from "@/components/ui";
import { IconKunci, IconPeringatan } from "@/components/icons";
import {
  fmtTanggal,
  fmtTanggalSingkat,
  hariIni,
  labelJadwalEfektif,
  statusJadwalEfektif,
} from "@/lib/format";
import { labelOf, STATUS_LAPORAN, toneOf } from "@/lib/constants";

const BULAN_SINGKAT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function KotakTanggal({ tanggal }) {
  const [, m, d] = tanggal.split("-").map(Number);
  return (
    <div className="tanggal-kotak">
      <strong>{d}</strong>
      <small>{BULAN_SINGKAT[m - 1]}</small>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const [equipment, reports, schedules, rooms] = await Promise.all([
    db.list("equipment"),
    db.list("reports"),
    db.list("schedules"),
    db.list("rooms"),
  ]);
  const users = await db.list("users");
  const namaUser = (id) => users.find((u) => u.id === id)?.nama || "Pengguna";
  const alatById = (id) => equipment.find((a) => a.id === id);

  const aktif = equipment.filter((a) => a.aktif);
  const baik = aktif.filter((a) => a.kondisi === "baik").length;
  const bulanIni = hariIni().slice(0, 7);
  const jadwalBulanIni = schedules.filter(
    (s) => s.status === "terjadwal" && s.tanggal.startsWith(bulanIni)
  ).length;
  const laporanTerbuka = reports.filter((r) => ["baru", "diproses"].includes(r.status)).length;

  const jadwalTerdekat = schedules
    .filter((s) => s.status === "terjadwal")
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal))
    .slice(0, 5);

  const laporanTerbaru = reports.filter((r) => r.status !== "draft").slice(0, 5);

  const perRuangan = rooms
    .map((room) => {
      const alat = aktif.filter((a) => a.room_id === room.id);
      return {
        room,
        total: alat.length,
        baik: alat.filter((a) => a.kondisi === "baik").length,
      };
    })
    .filter((x) => x.total > 0);

  const bisaCatat = ["admin", "petugas"].includes(user.role);

  return (
    <>
      <PageHead judul="Dashboard Perawatan Lab" sub={`${fmtTanggal(hariIni())} · SMK Bina Nusa Bekasi`}>
        {bisaCatat ? (
          <Link href="/riwayat/catat" className="btn">
            <IconKunci size={18} /> Catat Perawatan
          </Link>
        ) : null}
        <Link href="/laporan/baru" className={bisaCatat ? "btn btn-sekunder" : "btn"}>
          <IconPeringatan size={18} /> Buat Laporan
        </Link>
      </PageHead>

      <div className="stat-grid">
        <StatCard angka={aktif.length} label="Total peralatan terdaftar" terisi />
        <StatCard angka={baik} label="Peralatan kondisi baik" />
        <StatCard angka={jadwalBulanIni} label="Perlu perawatan bulan ini" />
        <StatCard angka={laporanTerbuka} label="Laporan kerusakan terbuka" />
      </div>

      <div className="grid-2">
        <section className="card">
          <div className="card-head">
            <h2>Jadwal perawatan terdekat</h2>
            <Link href="/jadwal">Lihat semua</Link>
          </div>
          {jadwalTerdekat.length === 0 ? (
            <p style={{ color: "var(--teks-redup)", fontSize: 14 }}>
              Belum ada jadwal perawatan.{" "}
              {bisaCatat ? <Link href="/jadwal/baru">Buat jadwal pertama</Link> : null}
            </p>
          ) : (
            <div className="baris-list">
              {jadwalTerdekat.map((j) => {
                const label = labelJadwalEfektif(j);
                const alat = j.equipment_id ? alatById(j.equipment_id) : null;
                const ruangan = j.room_id ? rooms.find((r) => r.id === j.room_id) : null;
                return (
                  <div className="baris" key={j.id}>
                    <KotakTanggal tanggal={j.tanggal} />
                    <div className="baris-isi">
                      <strong>{j.judul}</strong>
                      <small>
                        {j.jenis}
                        {alat ? ` · ${alat.nama}` : ""}
                        {ruangan ? ` · ${ruangan.nama}` : ""}
                      </small>
                    </div>
                    <div className="baris-kanan">
                      <Badge tone={label.tone}>{label.label}</Badge>
                      <small>{statusJadwalEfektif(j) === "terlewat" ? fmtTanggalSingkat(j.tanggal) : ""}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Laporan kerusakan terbaru</h2>
            <Link href="/laporan">Lihat semua</Link>
          </div>
          {laporanTerbaru.length === 0 ? (
            <p style={{ color: "var(--teks-redup)", fontSize: 14 }}>
              Belum ada laporan kerusakan masuk.
            </p>
          ) : (
            <div className="baris-list">
              {laporanTerbaru.map((r) => {
                const alat = alatById(r.equipment_id);
                return (
                  <div className="baris" key={r.id}>
                    <div className="baris-isi">
                      <strong>
                        <Link href={`/laporan/${r.id}`} style={{ color: "inherit" }}>
                          {alat ? alat.nama : "Peralatan"}: {r.deskripsi.slice(0, 60)}
                          {r.deskripsi.length > 60 ? "..." : ""}
                        </Link>
                      </strong>
                      <small>
                        {namaUser(r.pelapor_id)} · {fmtTanggalSingkat(r.created_at)}
                      </small>
                    </div>
                    <div className="baris-kanan">
                      <Badge tone={toneOf(STATUS_LAPORAN, r.status)}>
                        {labelOf(STATUS_LAPORAN, r.status)}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <section className="card mt">
        <div className="card-head">
          <h2>Kondisi peralatan per ruangan</h2>
          <Link href="/peralatan">Lihat peralatan</Link>
        </div>
        {perRuangan.length === 0 ? (
          <p style={{ color: "var(--teks-redup)", fontSize: 14 }}>
            Belum ada peralatan terdaftar.{" "}
            {bisaCatat ? <Link href="/peralatan/baru">Tambah peralatan pertama</Link> : null}
          </p>
        ) : (
          perRuangan.map(({ room, total, baik: jmlBaik }) => (
            <div className="kondisi-baris" key={room.id}>
              <div className="kondisi-info">
                <strong>{room.nama}</strong>
                <span>
                  {jmlBaik} dari {total} kondisi baik
                </span>
              </div>
              <div className="bar-track">
                <div className="bar-isi" style={{ width: `${Math.round((jmlBaik / total) * 100)}%` }} />
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
}
