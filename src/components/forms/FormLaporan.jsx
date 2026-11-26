"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FotoUpload from "./FotoUpload";
import { KATEGORI_KERUSAKAN } from "@/lib/constants";

export default function FormLaporan({ equipment, rooms, alatAwal = "" }) {
  const router = useRouter();
  const formRef = useRef(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const namaRuangan = (id) => rooms.find((r) => r.id === id)?.nama || "Tanpa ruangan";
  const terurut = [...equipment].sort((a, b) =>
    `${namaRuangan(a.room_id)} ${a.nama}`.localeCompare(`${namaRuangan(b.room_id)} ${b.nama}`)
  );

  async function kirim(e, status) {
    e.preventDefault();
    if (!formRef.current.reportValidity()) return;
    setError("");
    setLoading(status);
    const fd = new FormData(formRef.current);
    fd.set("status", status);
    try {
      const res = await fetch("/api/laporan", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan laporan.");
      router.push("/laporan");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading("");
    }
  }

  return (
    <form ref={formRef} onSubmit={(e) => kirim(e, "baru")}>
      {error ? <div className="pesan-error">{error}</div> : null}
      <div className="card">
        <div className="form-grid">
          <div className="field field-penuh">
            <label htmlFor="equipment_id">Peralatan yang Bermasalah *</label>
            <select id="equipment_id" name="equipment_id" className="select" required defaultValue={alatAwal}>
              <option value="" disabled>
                Pilih peralatan
              </option>
              {terurut.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nama} ({a.kode}) · {namaRuangan(a.room_id)}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="kategori">Kategori Kerusakan</label>
            <select id="kategori" name="kategori" className="select" defaultValue="Perangkat keras">
              {KATEGORI_KERUSAKAN.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div className="field field-penuh">
            <label htmlFor="deskripsi">Deskripsi Kerusakan *</label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              className="textarea"
              required
              placeholder="Ceritakan kerusakannya: sejak kapan, gejala yang terlihat, dan dampaknya ke pemakaian lab"
            />
          </div>
          <FotoUpload label="Foto Kerusakan" />
        </div>
        <div className="form-aksi">
          <button type="submit" className="btn" disabled={Boolean(loading)}>
            {loading === "baru" ? "Mengirim..." : "Kirim Laporan"}
          </button>
          <button
            type="button"
            className="btn btn-sekunder"
            disabled={Boolean(loading)}
            onClick={(e) => kirim(e, "draft")}
          >
            {loading === "draft" ? "Menyimpan..." : "Simpan sebagai Draft"}
          </button>
          <Link href="/laporan" className="btn btn-sekunder">
            Batal
          </Link>
        </div>
      </div>
    </form>
  );
}
