"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FormMasuk() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function kirim(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal masuk.");
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <>
      <form className="auth-form" onSubmit={kirim}>
        {error ? <div className="pesan-error">{error}</div> : null}
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="input" required autoComplete="email" placeholder="nama@sekolah.sch.id" />
        </div>
        <div className="field">
          <label htmlFor="password">Kata Sandi</label>
          <input id="password" name="password" type="password" className="input" required autoComplete="current-password" placeholder="Kata sandi Anda" />
        </div>
        <button type="submit" className="btn btn-block" disabled={loading}>
          {loading ? "Memeriksa..." : "Masuk"}
        </button>
      </form>
      <p className="auth-bawah">
        Belum punya akun? <Link href="/daftar">Daftar di sini</Link>
      </p>
    </>
  );
}
