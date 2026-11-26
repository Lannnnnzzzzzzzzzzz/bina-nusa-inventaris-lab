"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge, EmptyState } from "./ui";
import { IconPeringatan } from "./icons";
import { fmtTanggalSingkat } from "@/lib/format";
import { STATUS_LAPORAN, labelOf, toneOf } from "@/lib/constants";

const FILTER = [
  { id: "", label: "Semua" },
  { id: "baru", label: "Menunggu" },
  { id: "diproses", label: "Diproses" },
  { id: "selesai", label: "Selesai" },
  { id: "ditolak", label: "Ditolak" },
  { id: "draft", label: "Draft" },
];

export default function LaporanClient({ reports, equipment, users }) {
  const [filter, setFilter] = useState("");
  const alatById = (id) => equipment.find((a) => a.id === id);
  const namaUser = (id) => users.find((u) => u.id === id)?.nama || "Pengguna";

  const hasil = useMemo(
    () => reports.filter((r) => !filter || r.status === filter),
    [reports, filter]
  );

  return (
    <>
      <div className="filter-bar">
        <div className="chip-filter">
          {FILTER.map((f) => (
            <button
              key={f.id}
              type="button"
              className={filter === f.id ? "btn btn-kecil" : "btn btn-sekunder btn-kecil"}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {hasil.length === 0 ? (
        <EmptyState
          ikon={<IconPeringatan size={26} />}
          judul="Belum ada laporan"
          teks="Tidak ada laporan kerusakan pada filter ini."
        />
      ) : (
        <div className="card">
          <div className="baris-list">
            {hasil.map((r) => {
              const alat = alatById(r.equipment_id);
              return (
                <div className="baris" key={r.id}>
                  {r.foto_url ? (
                    <img
                      src={r.foto_url}
                      alt="Foto kerusakan"
                      style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover", flex: "none" }}
                    />
                  ) : null}
                  <div className="baris-isi">
                    <strong>
                      <Link href={`/laporan/${r.id}`} style={{ color: "inherit" }}>
                        {alat ? alat.nama : "Peralatan"}: {r.deskripsi.slice(0, 80)}
                        {r.deskripsi.length > 80 ? "..." : ""}
                      </Link>
                    </strong>
                    <small>
                      {r.kategori || "Lainnya"} · {namaUser(r.pelapor_id)} · {fmtTanggalSingkat(r.created_at)}
                    </small>
                  </div>
                  <div className="baris-kanan">
                    <Badge tone={toneOf(STATUS_LAPORAN, r.status)}>{labelOf(STATUS_LAPORAN, r.status)}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
