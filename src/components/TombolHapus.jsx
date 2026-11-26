"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconSampah } from "./icons";

export default function TombolHapus({ url, keSetelah, pesan }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function hapus() {
    if (!window.confirm(pesan || "Hapus data ini? Tindakan tidak bisa dibatalkan.")) return;
    setLoading(true);
    try {
      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus.");
      router.push(keSetelah);
      router.refresh();
    } catch (e) {
      alert(e.message);
      setLoading(false);
    }
  }

  return (
    <button type="button" className="btn btn-bahaya" onClick={hapus} disabled={loading}>
      <IconSampah size={17} /> {loading ? "Menghapus..." : "Hapus"}
    </button>
  );
}
