function I({ children, size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const IconBeranda = (p) => (
  <I {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </I>
);
export const IconPeralatan = (p) => (
  <I {...p}>
    <path d="M21 8.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-11" />
    <path d="M1.5 4.5A1.5 1.5 0 0 1 3 3h18a1.5 1.5 0 0 1 1.5 1.5V8a1.5 1.5 0 0 1-1.5 1.5H3A1.5 1.5 0 0 1 1.5 8Z" />
    <path d="M10 13h4" />
  </I>
);
export const IconKalender = (p) => (
  <I {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </I>
);
export const IconPeringatan = (p) => (
  <I {...p}>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4M12 17h.01" />
  </I>
);
export const IconRiwayat = (p) => (
  <I {...p}>
    <path d="M3 12a9 9 0 1 0 2.6-6.3L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l3.5 2" />
  </I>
);
export const IconKunci = (p) => (
  <I {...p}>
    <path d="M14.7 6.3a4.5 4.5 0 0 0-6 6L3 18l3 3 5.7-5.7a4.5 4.5 0 0 0 6-6L14 13l-3-3 3.7-3.7Z" />
  </I>
);
export const IconGrafik = (p) => (
  <I {...p}>
    <path d="M3 3v18h18" />
    <path d="M8 17v-6M13 17V7M18 17v-9" />
  </I>
);
export const IconPengaturan = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.51 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.23.6.86 1 1.51 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z" />
  </I>
);
export const IconPengguna = (p) => (
  <I {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
  </I>
);
export const IconKeluar = (p) => (
  <I {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5M21 12H9" />
  </I>
);
export const IconPlus = (p) => (
  <I {...p}>
    <path d="M12 5v14M5 12h14" />
  </I>
);
export const IconCari = (p) => (
  <I {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </I>
);
export const IconKembali = (p) => (
  <I {...p}>
    <path d="m15 18-6-6 6-6" />
  </I>
);
export const IconKamera = (p) => (
  <I {...p}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
    <circle cx="12" cy="13" r="4" />
  </I>
);
export const IconCek = (p) => (
  <I {...p}>
    <path d="M20 6 9 17l-5-5" />
  </I>
);
export const IconX = (p) => (
  <I {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </I>
);
export const IconUnduh = (p) => (
  <I {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="m7 10 5 5 5-5M12 15V3" />
  </I>
);
export const IconRuangan = (p) => (
  <I {...p}>
    <rect x="4" y="3" width="16" height="18" rx="1" />
    <path d="M9 21v-4h6v4M8 7h2m4 0h2M8 11h2m4 0h2" />
  </I>
);
export const IconDokumen = (p) => (
  <I {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6M9 13h6M9 17h6" />
  </I>
);
export const IconSampah = (p) => (
  <I {...p}>
    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6" />
  </I>
);
export const IconPensil = (p) => (
  <I {...p}>
    <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </I>
);
