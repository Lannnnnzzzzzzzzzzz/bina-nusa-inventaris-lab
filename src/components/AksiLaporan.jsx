"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KONDISI } from "@/lib/constants";

export default function AksiLaporan({ laporan, peran }) {
  const router = useRouter();
  const [catatan, setCatatan] = useState(laporan.catatan_resolusi || "");
  const [kondisiAkhir, setKondisiAkhir] = useState("baik");
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  async function ubah(status) {
    setError("");
    setLoading(status);
    try {
      const res = await fetch("/api/laporan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: laporan.id,
          status,
          catatan_resolusi: catatan,
          kondisi_akhir: status === "selesai" ? kondisiAkhir : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengubah status.");
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading("");
    }
  }

  async function hapusDraft() {
    if (!window.confirm("Hapus draft laporan ini?")) return;
    const res = await fetch(`/api/laporan?id=${laporan.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/laporan");
      router.refresh();
    }
  }

  if (laporan.status === "draft") {
    return (
      <div className="card">
        <div className="card-head">
          <h2>Draft Laporan</h2>
        </div>
        <p style={{ fontSize: 14, color: "var(--teks-redup)", marginBottom: 14 }}>
          Laporan ini belum terkirim ke petugas. Kirim sekarang agar masuk antrian penanganan.
        </p>
        {error ? <div className="pesan-error">{error}</div> : null}
        <div className="form-aksi" style={{ marginTop: 0 }}>
          <button type="button" className="btn" onClick={() => ubah("baru")} disabled={Boolean(loading)}>
            {loading === "baru" ? "Mengirim..." : "Kirim Laporan"}
          </button>
          <button type="button" className="btn btn-bahaya" onClick={hapusDraft}>
            Hapus Draft
          </button>
        </div>
      </div>
    );
  }

  if (!["petugas", "admin"].includes(peran)) return null;
  if (["selesai", "ditolak"].includes(laporan.status)) return null;

  return (
    <div className="card">
      <div className="card-head">
        <h2>Tindak Lanjut Petugas</h2>
      </div>
      {error ? <div className="pesan-error">{error}</div> : null}
      <div className="form-grid">
        <div className="field field-penuh">
          <label htmlFor="catatan">Catatan Resolusi</label>
          <textarea
            id="catatan"
            className="textarea"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Hasil pemeriksaan, tindakan perbaikan, atau alasan penolakan"
          />
        </div>
        {laporan.status === "diproses" ? (
          <div className="field field-penuh">
            <label htmlFor="kondisi_akhir">Kondisi Alat Setelah Selesai</label>
            <select
              id="kondisi_akhir"
              className="select"
              value={kondisiAkhir}
              onChange={(e) => setKondisiAkhir(e.target.value)}
            >
              {KONDISI.filter((k) => k.id !== "dalam_perbaikan").map((k) => (
                <option key={k.id} value={k.id}>
                  {k.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>
      <div className="form-aksi">
        {laporan.status === "baru" ? (
          <button type="button" className="btn" onClick={() => ubah("diproses")} disabled={Boolean(loading)}>
            {loading === "diproses" ? "Memproses..." : "Mulai Proses"}
          </button>
        ) : null}
        {laporan.status === "diproses" ? (
          <button type="button" className="btn" onClick={() => ubah("selesai")} disabled={Boolean(loading)}>
            {loading === "selesai" ? "Menyimpan..." : "Tandai Selesai"}
          </button>
        ) : null}
        <button type="button" className="btn btn-bahaya" onClick={() => ubah("ditolak")} disabled={Boolean(loading)}>
          {loading === "ditolak" ? "Memproses..." : "Tolak Laporan"}
        </button>
      </div>
      <p style={{ fontSize: 13, color: "var(--teks-redup)", marginTop: 12 }}>
        Saat laporan mulai diproses, kondisi alat otomatis menjadi Dalam Perbaikan. Saat ditandai
        selesai, kondisi alat mengikuti pilihan di atas dan riwayat perawatan tercatat otomatis.
      </p>
    </div>
  );
}
