"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "./ui";
import { IconPlus, IconSampah } from "./icons";
import { ROLES, labelOf } from "@/lib/constants";

export default function PengaturanClient({ rooms, users, userSaya }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState("");
  const [sibuk, setSibuk] = useState(false);

  async function panggil(url, method, body) {
    setError("");
    setSukses("");
    setSibuk(true);
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Terjadi kesalahan.");
      router.refresh();
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setSibuk(false);
    }
  }

  async function tambahRuangan(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const ok = await panggil("/api/ruangan", "POST", { nama: fd.get("nama") });
    if (ok) {
      e.currentTarget.reset();
      setSukses("Ruangan ditambahkan.");
    }
  }

  async function hapusRuangan(id, nama) {
    if (!window.confirm(`Hapus ruangan ${nama}? Peralatan di ruangan ini menjadi tanpa ruangan.`)) return;
    await panggil(`/api/ruangan?id=${id}`, "DELETE");
  }

  async function buatAkun(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const ok = await panggil("/api/pengguna", "POST", {
      nama: fd.get("nama"),
      email: fd.get("email"),
      password: fd.get("password"),
      role: fd.get("role"),
    });
    if (ok) {
      e.currentTarget.reset();
      setSukses("Akun baru dibuat dan langsung aktif.");
    }
  }

  async function ubahPengguna(id, patch, pesanSukses) {
    const ok = await panggil("/api/pengguna", "PATCH", { id, ...patch });
    if (ok && pesanSukses) setSukses(pesanSukses);
  }

  async function resetSandi(id, nama) {
    const pw = window.prompt(`Kata sandi baru untuk ${nama} (minimal 8 karakter):`);
    if (!pw) return;
    await ubahPengguna(id, { password: pw }, `Kata sandi ${nama} sudah diganti.`);
  }

  const pending = users.filter((u) => u.status === "pending");

  return (
    <>
      {error ? <div className="pesan-error">{error}</div> : null}
      {sukses ? <div className="pesan-sukses">{sukses}</div> : null}

      {pending.length > 0 ? (
        <section className="card" style={{ marginBottom: 16 }}>
          <div className="card-head">
            <h2>Menunggu Verifikasi ({pending.length})</h2>
          </div>
          <div className="baris-list">
            {pending.map((u) => (
              <div className="baris" key={u.id}>
                <div className="baris-isi">
                  <strong>{u.nama}</strong>
                  <small>{u.email}</small>
                </div>
                <div className="baris-kanan" style={{ flexDirection: "row", gap: 8 }}>
                  <button type="button" className="btn btn-kecil" disabled={sibuk} onClick={() => ubahPengguna(u.id, { status: "aktif" }, `${u.nama} diverifikasi.`)}>
                    Verifikasi
                  </button>
                  <button type="button" className="btn btn-bahaya btn-kecil" disabled={sibuk} onClick={() => ubahPengguna(u.id, { status: "nonaktif" }, `Pendaftaran ${u.nama} ditolak.`)}>
                    Tolak
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid-2">
        <section className="card">
          <div className="card-head">
            <h2>Ruangan Lab</h2>
          </div>
          <form onSubmit={tambahRuangan} style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <input name="nama" className="input" required placeholder="Nama ruangan baru" style={{ flex: 1 }} />
            <button type="submit" className="btn" disabled={sibuk}>
              <IconPlus size={17} /> Tambah
            </button>
          </form>
          {rooms.length === 0 ? (
            <p style={{ color: "var(--teks-redup)", fontSize: 14 }}>
              Belum ada ruangan. Tambahkan, misalnya Lab Komputer 1 dan Lab Komputer 2.
            </p>
          ) : (
            <div className="baris-list">
              {rooms.map((r) => (
                <div className="baris" key={r.id}>
                  <div className="baris-isi">
                    <strong>{r.nama}</strong>
                  </div>
                  <button type="button" className="btn-ikon" onClick={() => hapusRuangan(r.id, r.nama)} aria-label={`Hapus ${r.nama}`}>
                    <IconSampah size={17} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Buat Akun Langsung</h2>
          </div>
          <form onSubmit={buatAkun} className="auth-form">
            <div className="field">
              <label htmlFor="u-nama">Nama</label>
              <input id="u-nama" name="nama" className="input" required />
            </div>
            <div className="field">
              <label htmlFor="u-email">Email</label>
              <input id="u-email" name="email" type="email" className="input" required />
            </div>
            <div className="field">
              <label htmlFor="u-password">Kata Sandi</label>
              <input id="u-password" name="password" type="password" className="input" required minLength={8} />
            </div>
            <div className="field">
              <label htmlFor="u-role">Peran</label>
              <select id="u-role" name="role" className="select" defaultValue="guru">
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn" disabled={sibuk}>
              Buat Akun
            </button>
          </form>
        </section>
      </div>

      <section className="card mt">
        <div className="card-head">
          <h2>Semua Pengguna ({users.length})</h2>
        </div>
        <div className="tabel-wrap" style={{ boxShadow: "none" }}>
          <table className="tabel">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Peran</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.nama}</strong>
                    {u.id === userSaya ? " (Anda)" : ""}
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      className="select"
                      style={{ minHeight: 36, padding: "6px 10px" }}
                      value={u.role}
                      disabled={sibuk || u.id === userSaya}
                      onChange={(e) => ubahPengguna(u.id, { role: e.target.value }, `Peran ${u.nama} diubah.`)}
                    >
                      {ROLES.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <Badge tone={u.status === "aktif" ? "hijau" : u.status === "pending" ? "kuning" : "merah"}>
                      {u.status === "aktif" ? "Aktif" : u.status === "pending" ? "Menunggu" : "Nonaktif"}
                    </Badge>
                  </td>
                  <td>
                    <span style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>
                      {u.status !== "aktif" ? (
                        <button type="button" className="btn btn-sekunder btn-kecil" disabled={sibuk} onClick={() => ubahPengguna(u.id, { status: "aktif" }, `${u.nama} diaktifkan.`)}>
                          Aktifkan
                        </button>
                      ) : u.id !== userSaya ? (
                        <button type="button" className="btn btn-sekunder btn-kecil" disabled={sibuk} onClick={() => ubahPengguna(u.id, { status: "nonaktif" }, `${u.nama} dinonaktifkan.`)}>
                          Nonaktifkan
                        </button>
                      ) : null}
                      <button type="button" className="btn btn-sekunder btn-kecil" disabled={sibuk} onClick={() => resetSandi(u.id, u.nama)}>
                        Ganti Sandi
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 13, color: "var(--teks-redup)", marginTop: 12 }}>
          Peran saat ini: {labelOf(ROLES, "admin")} mengelola semua, {labelOf(ROLES, "petugas")} memproses
          laporan dan merawat peralatan, {labelOf(ROLES, "guru")} membuat laporan kerusakan.
        </p>
      </section>
    </>
  );
}
