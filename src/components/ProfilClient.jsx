"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FotoUpload from "./forms/FotoUpload";
import { Avatar } from "./ui";
import {
  IconGrafik,
  IconKeluar,
  IconPengaturan,
  IconRiwayat,
} from "./icons";
import { ROLES, labelOf } from "@/lib/constants";

export default function ProfilClient({ user }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState("");
  const [loading, setLoading] = useState(false);

  async function kirim(e) {
    e.preventDefault();
    setError("");
    setSukses("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/profil", { method: "PATCH", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan profil.");
      setSukses("Profil tersimpan.");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function keluar() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/masuk");
    router.refresh();
  }

  return (
    <>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar user={user} size={64} />
          <div>
            <h2 style={{ fontSize: 19, fontWeight: 800, color: "var(--biru-gelap)" }}>{user.nama}</h2>
            <p style={{ color: "var(--teks-redup)", fontSize: 14 }}>
              {user.email} · {labelOf(ROLES, user.role)}
            </p>
          </div>
        </div>
      </div>

      <div className="card hanya-mobile" style={{ marginBottom: 16 }}>
        <div className="card-head">
          <h2>Menu Lainnya</h2>
        </div>
        <div className="baris-list">
          <Link href="/riwayat" className="baris" style={{ color: "inherit", alignItems: "center" }}>
            <IconRiwayat size={20} />
            <span className="baris-isi">
              <strong>Riwayat Perawatan</strong>
            </span>
          </Link>
          {["admin", "petugas"].includes(user.role) ? (
            <Link href="/rekap" className="baris" style={{ color: "inherit", alignItems: "center" }}>
              <IconGrafik size={20} />
              <span className="baris-isi">
                <strong>Rekap & Ekspor</strong>
              </span>
            </Link>
          ) : null}
          {user.role === "admin" ? (
            <Link href="/pengaturan" className="baris" style={{ color: "inherit", alignItems: "center" }}>
              <IconPengaturan size={20} />
              <span className="baris-isi">
                <strong>Pengaturan</strong>
              </span>
            </Link>
          ) : null}
        </div>
      </div>

      <form onSubmit={kirim}>
        {error ? <div className="pesan-error">{error}</div> : null}
        {sukses ? <div className="pesan-sukses">{sukses}</div> : null}
        <div className="card">
          <div className="card-head">
            <h2>Ubah Profil & Kata Sandi</h2>
          </div>
          <div className="form-grid">
            <div className="field field-penuh">
              <label htmlFor="nama">Nama Lengkap</label>
              <input id="nama" name="nama" className="input" defaultValue={user.nama} required />
            </div>
            <FotoUpload label="Foto Profil" awal={user.avatar_url || null} />
            <div className="field">
              <label htmlFor="password_lama">Kata Sandi Lama</label>
              <input id="password_lama" name="password_lama" type="password" className="input" autoComplete="current-password" placeholder="Isi hanya bila ganti sandi" />
            </div>
            <div className="field">
              <label htmlFor="password_baru">Kata Sandi Baru</label>
              <input id="password_baru" name="password_baru" type="password" className="input" autoComplete="new-password" placeholder="Minimal 8 karakter" />
            </div>
          </div>
          <div className="form-aksi">
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Profil"}
            </button>
            <button type="button" className="btn btn-bahaya" onClick={keluar}>
              <IconKeluar size={17} /> Keluar dari Akun
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
