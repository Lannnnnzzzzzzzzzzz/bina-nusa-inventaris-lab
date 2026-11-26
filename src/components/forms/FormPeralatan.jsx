"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FotoUpload from "./FotoUpload";
import { KATEGORI_ALAT, KONDISI } from "@/lib/constants";

export default function FormPeralatan({ rooms, awal = null }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const edit = Boolean(awal);

  async function kirim(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    if (edit) fd.set("id", awal.id);
    try {
      const res = await fetch("/api/peralatan", {
        method: edit ? "PATCH" : "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan peralatan.");
      router.push(`/peralatan/${data.equipment.id}`);
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
            <label htmlFor="nama">Nama Peralatan *</label>
            <input id="nama" name="nama" className="input" required defaultValue={awal?.nama || ""} placeholder="Contoh: PC Unit 07, Proyektor Lab 2" />
          </div>
          <div className="field">
            <label htmlFor="kategori">Kategori</label>
            <select id="kategori" name="kategori" className="select" defaultValue={awal?.kategori || "Komputer"}>
              {KATEGORI_ALAT.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="room_id">Ruangan</label>
            <select id="room_id" name="room_id" className="select" defaultValue={awal?.room_id || ""}>
              <option value="">Tanpa ruangan</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nama}
                </option>
              ))}
            </select>
            <small>Ruangan baru bisa ditambah admin di menu Pengaturan.</small>
          </div>
          <div className="field">
            <label htmlFor="kondisi">Kondisi Saat Ini</label>
            <select id="kondisi" name="kondisi" className="select" defaultValue={awal?.kondisi || "baik"}>
              {KONDISI.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.label}
                </option>
              ))}
            </select>
          </div>
          {edit ? (
            <div className="field">
              <label htmlFor="aktif">Status Pemakaian</label>
              <select id="aktif" name="aktif" className="select" defaultValue={awal.aktif ? "true" : "false"}>
                <option value="true">Aktif dipakai</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
          ) : null}
          <div className="field field-penuh">
            <label htmlFor="catatan">Catatan</label>
            <textarea id="catatan" name="catatan" className="textarea" defaultValue={awal?.catatan || ""} placeholder="Spesifikasi, nomor seri, atau keterangan lain" />
          </div>
          <FotoUpload label="Foto Peralatan" awal={awal?.foto_url || null} />
        </div>
        <div className="form-aksi">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Menyimpan..." : edit ? "Simpan Perubahan" : "Tambah Peralatan"}
          </button>
          <Link href={edit ? `/peralatan/${awal.id}` : "/peralatan"} className="btn btn-sekunder">
            Batal
          </Link>
        </div>
      </div>
    </form>
  );
}
