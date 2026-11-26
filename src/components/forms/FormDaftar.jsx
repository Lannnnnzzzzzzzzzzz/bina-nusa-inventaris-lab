"use client";

import { useState } from "react";
import Link from "next/link";

export default function FormDaftar() {
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState("");
  const [loading, setLoading] = useState(false);

  async function kirim(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: fd.get("nama"),
          email: fd.get("email"),
          password: fd.get("password"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Pendaftaran gagal.");
      setSukses(data.pesan);
      e.currentTarget.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="auth-form" onSubmit={kirim}>
        {error ? <div className="pesan-error">{error}</div> : null}
        {sukses ? <div className="pesan-sukses">{sukses}</div> : null}
        <div className="field">
          <label htmlFor="nama">Nama Lengkap</label>
          <input id="nama" name="nama" className="input" required autoComplete="name" placeholder="Nama Anda" />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="input" required autoComplete="email" placeholder="nama@sekolah.sch.id" />
        </div>
        <div className="field">
          <label htmlFor="password">Kata Sandi</label>
          <input id="password" name="password" type="password" className="input" required minLength={8} autoComplete="new-password" placeholder="Minimal 8 karakter" />
        </div>
        <button type="submit" className="btn btn-block" disabled={loading}>
          {loading ? "Mengirim..." : "Daftar"}
        </button>
      </form>
      <p className="auth-bawah">
        Sudah punya akun? <Link href="/masuk">Masuk di sini</Link>
      </p>
    </>
  );
}
