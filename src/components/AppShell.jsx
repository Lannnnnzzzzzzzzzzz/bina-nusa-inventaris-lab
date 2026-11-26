"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  IconBeranda,
  IconPeralatan,
  IconKalender,
  IconPeringatan,
  IconRiwayat,
  IconGrafik,
  IconPengaturan,
  IconPengguna,
  IconKeluar,
} from "./icons";
import { Avatar } from "./ui";
import { labelOf, ROLES } from "@/lib/constants";

const MENU = [
  { href: "/", label: "Dashboard", ikon: IconBeranda },
  { href: "/peralatan", label: "Peralatan", ikon: IconPeralatan },
  { href: "/jadwal", label: "Jadwal Perawatan", ikon: IconKalender },
  { href: "/laporan", label: "Laporan Kerusakan", ikon: IconPeringatan },
  { href: "/riwayat", label: "Riwayat Perawatan", ikon: IconRiwayat },
  { href: "/rekap", label: "Rekap & Ekspor", ikon: IconGrafik, peran: ["admin", "petugas"] },
  { href: "/pengaturan", label: "Pengaturan", ikon: IconPengaturan, peran: ["admin"] },
];

const MENU_BAWAH = [
  { href: "/", label: "Beranda", ikon: IconBeranda },
  { href: "/peralatan", label: "Peralatan", ikon: IconPeralatan },
  { href: "/laporan", label: "Laporan", ikon: IconPeringatan },
  { href: "/jadwal", label: "Jadwal", ikon: IconKalender },
  { href: "/profil", label: "Akun", ikon: IconPengguna },
];

function aktif(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AppShell({ user, children }) {
  const pathname = usePathname();
  const router = useRouter();

  async function keluar() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/masuk");
    router.refresh();
  }

  const menu = MENU.filter((m) => !m.peran || m.peran.includes(user.role));

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <img src="/logo.png" alt="Logo SMK Bina Nusa" className="brand-logo" />
          <div>
            <div className="brand-nama">SMK Bina Nusa</div>
            <div className="brand-sub">Perawatan Laboratorium</div>
          </div>
        </div>
        <nav className="side-nav">
          {menu.map((m) => {
            const Ikon = m.ikon;
            return (
              <Link
                key={m.href}
                href={m.href}
                className={`side-link${aktif(pathname, m.href) ? " aktif" : ""}`}
              >
                <Ikon size={19} />
                <span>{m.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="side-user">
          <Link href="/profil" className="side-user-info">
            <Avatar user={user} size={38} />
            <span className="side-user-teks">
              <strong>{user.nama}</strong>
              <small>{labelOf(ROLES, user.role)}</small>
            </span>
          </Link>
          <button type="button" className="btn-ikon" onClick={keluar} title="Keluar" aria-label="Keluar">
            <IconKeluar size={19} />
          </button>
        </div>
      </aside>

      <header className="topbar">
        <div className="brand brand-ringkas">
          <img src="/logo.png" alt="Logo SMK Bina Nusa" className="brand-logo" />
          <div>
            <div className="brand-nama">SMK Bina Nusa</div>
            <div className="brand-sub">Perawatan Laboratorium</div>
          </div>
        </div>
        <Link href="/profil" aria-label="Profil">
          <Avatar user={user} size={36} />
        </Link>
      </header>

      <main className="konten">{children}</main>

      <nav className="bottom-nav">
        {MENU_BAWAH.map((m) => {
          const Ikon = m.ikon;
          return (
            <Link
              key={m.href}
              href={m.href}
              className={`bottom-link${aktif(pathname, m.href) ? " aktif" : ""}`}
            >
              <Ikon size={21} />
              <span>{m.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
