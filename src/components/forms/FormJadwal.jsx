"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { JENIS_PERAWATAN, ULANGAN } from "@/lib/constants";
import { hariIni } from "@/lib/format";

export default function FormJadwal({ equipment, rooms }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sasaran, setSasaran] = useState("ruangan");

  async function kirim(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      judul: fd.get("judul"),
      jenis: fd.get("jenis"),
      tanggal: fd.get("tanggal"),
      ulangan: fd.get("ulangan"),
      equipment_id: sasaran === "alat" ? fd.get("equipment_id") : null,
      room_id: sasaran === "ruangan" ? fd.get("room_id") : null,
    };
    try {
      const res = await fetch("/api/jadwal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat jadwal.");
      router.push("/jadwal");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={kirim}>
      {error ? <div className="pesan-error">{error}</div> : null}
      <div className="card">
        <div className="form-grid">
          <div className="field field-penuh">
            <label htmlFor="judul">Judul Perawatan *</label>
            <input id="judul" name="judul" className="input" required placeholder="Contoh: Pembersihan dan pengecekan berkala PC Lab Komputer 1" />
          </div>
          <div className="field">
            <label htmlFor="jenis">Jenis Perawatan</label>
            <select id="jenis" name="jenis" className="select" defaultValue="Pengecekan berkala">
              {JENIS_PERAWATAN.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="tanggal">Tanggal *</label>
            <input id="tanggal" name="tanggal" type="date" className="input" required defaultValue={hariIni()} />
          </div>
          <div className="field">
            <label htmlFor="sasaran">Sasaran</label>
            <select id="sasaran" className="select" value={sasaran} onChange={(e) => setSasaran(e.target.value)}>
              <option value="ruangan">Satu ruangan</option>
              <option value="alat">Satu peralatan</option>
            </select>
          </div>
          {sasaran === "ruangan" ? (
            <div className="field">
              <label htmlFor="room_id">Ruangan</label>
              <select id="room_id" name="room_id" className="select" defaultValue="">
                <option value="">Pilih ruangan</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nama}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="field">
              <label htmlFor="equipment_id">Peralatan</label>
              <select id="equipment_id" name="equipment_id" className="select" defaultValue="">
                <option value="">Pilih peralatan</option>
                {equipment.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nama} ({a.kode})
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="field">
            <label htmlFor="ulangan">Pengulangan</label>
            <select id="ulangan" name="ulangan" className="select" defaultValue="tidak">
              {ULANGAN.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
            <small>Jadwal berulang otomatis dibuat lagi setelah ditandai selesai.</small>
          </div>
        </div>
        <div className="form-aksi">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Menyimpan..." : "Buat Jadwal"}
          </button>
          <Link href="/jadwal" className="btn btn-sekunder">
            Batal
          </Link>
        </div>
      </div>
    </form>
  );
}
