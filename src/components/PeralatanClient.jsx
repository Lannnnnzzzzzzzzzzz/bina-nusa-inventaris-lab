"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge, EmptyState } from "./ui";
import { IconCari, IconPeralatan } from "./icons";
import { KONDISI, labelOf, toneOf } from "@/lib/constants";

export default function PeralatanClient({ equipment, rooms }) {
  const [cari, setCari] = useState("");
  const [roomId, setRoomId] = useState("");
  const [kondisi, setKondisi] = useState("");

  const namaRuangan = (id) => rooms.find((r) => r.id === id)?.nama || "Tanpa ruangan";

  const hasil = useMemo(() => {
    return equipment.filter((a) => {
      if (roomId && a.room_id !== roomId) return false;
      if (kondisi && a.kondisi !== kondisi) return false;
      if (cari) {
        const q = cari.toLowerCase();
        const cocok =
          a.nama.toLowerCase().includes(q) ||
          a.kode.toLowerCase().includes(q) ||
          (a.kategori || "").toLowerCase().includes(q);
        if (!cocok) return false;
      }
      return true;
    });
  }, [equipment, cari, roomId, kondisi]);

  return (
    <>
      <div className="filter-bar">
        <div className="cari-box">
          <IconCari size={18} />
          <input
            className="input"
            placeholder="Cari nama, kode, atau kategori peralatan"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
          />
        </div>
        <select className="select" style={{ width: "auto" }} value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          <option value="">Semua ruangan</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nama}
            </option>
          ))}
        </select>
        <select className="select" style={{ width: "auto" }} value={kondisi} onChange={(e) => setKondisi(e.target.value)}>
          <option value="">Semua kondisi</option>
          {KONDISI.map((k) => (
            <option key={k.id} value={k.id}>
              {k.label}
            </option>
          ))}
        </select>
      </div>

      {hasil.length === 0 ? (
        <EmptyState
          ikon={<IconPeralatan size={26} />}
          judul="Tidak ada peralatan yang cocok"
          teks="Coba ubah kata kunci atau filter, atau tambahkan peralatan baru bila Anda petugas lab."
        />
      ) : (
        <div className="alat-grid">
          {hasil.map((a) => (
            <Link href={`/peralatan/${a.id}`} className="alat-card" key={a.id}>
              <div className="alat-foto">
                {a.foto_url ? <img src={a.foto_url} alt={a.nama} /> : <IconPeralatan size={40} />}
              </div>
              <div className="alat-isi">
                <h3>{a.nama}</h3>
                <div className="alat-meta">{namaRuangan(a.room_id)}</div>
                <div className="alat-meta">{a.kategori || "Lainnya"}</div>
                <div className="alat-bawah">
                  <span className="kode">{a.kode}</span>
                  <Badge tone={toneOf(KONDISI, a.kondisi)}>{labelOf(KONDISI, a.kondisi)}</Badge>
                </div>
                {!a.aktif ? (
                  <div>
                    <Badge tone="abu">Nonaktif</Badge>
                  </div>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
