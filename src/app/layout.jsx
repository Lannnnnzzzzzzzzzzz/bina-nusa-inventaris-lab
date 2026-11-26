import "./globals.css";

export const metadata = {
  title: "Perawatan Lab SMK Bina Nusa",
  description:
    "Aplikasi perawatan laboratorium SMK Bina Nusa Bekasi: inventaris peralatan, laporan kerusakan berfoto, jadwal dan riwayat perawatan.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
