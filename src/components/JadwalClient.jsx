"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, EmptyState } from "./ui";
import { IconCek, IconKalender, IconSampah } from "./icons";
import { fmtTanggal, labelJadwalEfektif, statusJadwalEfektif } from "@/lib/format";

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

export default function JadwalClient({ schedules, equipment, rooms, bisaKelola }) {
  const router = useRouter();
  const [sibuk, setSibuk] = useState("");
  const namaAlat = (id) => equipment.find((a) => a.id === id)?.nama;
  const namaRuangan = (id) => rooms.find((r) => r.id === id)?.nama;

  async function selesai(id) {
    setSibuk(id);
    try {
      const res = await fetch("/api/jadwal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, aksi: "selesai" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menandai selesai.");
      router.refresh();
    } catch (e) {
      alert(e.message);
    } finally {
      setSibuk("");
    }
  }

  async function hapus(id) {
    if (!window.confirm("Hapus jadwal ini?")) return;
    setSibuk(id);
    try {
      const res = await fetch(`/api/jadwal?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus jadwal.");
      router.refresh();
    } catch (e) {
      alert(e.message);
    } finally {
      setSibuk("");
    }
  }

  const akanDatang = schedules
    .filter((s) => s.status === "terjadwal")
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal));
  const sudahSelesai = schedules.filter((s) => s.status === "selesai");

  function Baris({ j }) {
    const label = labelJadwalEfektif(j);
    const alat = j.equipment_id ? namaAlat(j.equipment_id) : null;
    const ruangan = j.room_id ? namaRuangan(j.room_id) : null;
    return (
      <div className="baris">
        <KotakTanggal tanggal={j.tanggal} />
        <div className="baris-isi">
          <strong>{j.judul}</strong>
          <small>
            {j.jenis}
            {alat ? ` · ${alat}` : ""}
            {ruangan ? ` · ${ruangan}` : ""} · {fmtTanggal(j.tanggal)}
            {j.ulangan !== "tidak" ? " · berulang" : ""}
          </small>
        </div>
        <div className="baris-kanan">
          <Badge tone={label.tone}>{label.label}</Badge>
          {bisaKelola && j.status === "terjadwal" ? (
            <span style={{ display: "inline-flex", gap: 6 }}>
              <button type="button" className="btn btn-kecil" onClick={() => selesai(j.id)} disabled={sibuk === j.id} title="Tandai selesai dan catat ke riwayat">
                <IconCek size={15} /> Selesai
              </button>
              <button type="button" className="btn-ikon" onClick={() => hapus(j.id)} disabled={sibuk === j.id} title="Hapus jadwal" aria-label="Hapus jadwal">
                <IconSampah size={17} />
              </button>
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="card">
        <div className="card-head">
          <h2>Jadwal Akan Datang & Terlewat</h2>
        </div>
        {akanDatang.length === 0 ? (
          <EmptyState
            ikon={<IconKalender size={26} />}
            judul="Tidak ada jadwal aktif"
            teks="Semua jadwal sudah selesai atau belum ada jadwal yang dibuat."
          />
        ) : (
          <div className="baris-list">
            {akanDatang.map((j) => (
              <Baris key={j.id} j={j} />
            ))}
          </div>
        )}
      </section>

      {sudahSelesai.length > 0 ? (
        <section className="card mt">
          <div className="card-head">
            <h2>Sudah Selesai</h2>
          </div>
          <div className="baris-list">
            {sudahSelesai.slice(0, 10).map((j) => (
              <Baris key={j.id} j={j} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
