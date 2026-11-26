"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { JENIS_PERAWATAN, KONDISI } from "@/lib/constants";
import { hariIni } from "@/lib/format";

export default function FormCatat({ equipment, rooms }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const namaRuangan = (id) => rooms.find((r) => r.id === id)?.nama || "Tanpa ruangan";

  async function kirim(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      equipment_id: fd.get("equipment_id"),
      tanggal: fd.get("tanggal"),
      jenis: fd.get("jenis"),
      deskripsi: fd.get("deskripsi"),
      biaya: fd.get("biaya"),
      kondisi_setelah: fd.get("kondisi_setelah") || null,
    };
    try {
      const res = await fetch("/api/catat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan catatan.");
      router.push("/riwayat");
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
            <label htmlFor="equipment_id">Peralatan yang Dirawat *</label>
            <select id="equipment_id" name="equipment_id" className="select" required defaultValue="">
              <option value="" disabled>
                Pilih peralatan
              </option>
              {equipment.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nama} ({a.kode}) · {namaRuangan(a.room_id)}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="tanggal">Tanggal Perawatan</label>
            <input id="tanggal" name="tanggal" type="date" className="input" defaultValue={hariIni()} />
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
          <div className="field field-penuh">
            <label htmlFor="deskripsi">Deskripsi Pekerjaan *</label>
            <textarea id="deskripsi" name="deskripsi" className="textarea" required placeholder="Apa saja yang dikerjakan, suku cadang yang diganti, dan hasil akhirnya" />
          </div>
          <div className="field">
            <label htmlFor="biaya">Biaya (Rp, bila ada)</label>
            <input id="biaya" name="biaya" type="number" min="0" className="input" placeholder="0" />
          </div>
          <div className="field">
            <label htmlFor="kondisi_setelah">Kondisi Setelah Perawatan</label>
            <select id="kondisi_setelah" name="kondisi_setelah" className="select" defaultValue="">
              <option value="">Tidak diubah</option>
              {KONDISI.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-aksi">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Catatan"}
          </button>
          <Link href="/riwayat" className="btn btn-sekunder">
            Batal
          </Link>
        </div>
      </div>
    </form>
  );
}
