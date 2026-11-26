export const KONDISI = [
  { id: "baik", label: "Baik", tone: "hijau" },
  { id: "rusak_ringan", label: "Rusak Ringan", tone: "kuning" },
  { id: "rusak_berat", label: "Rusak Berat", tone: "merah" },
  { id: "dalam_perbaikan", label: "Dalam Perbaikan", tone: "biru" },
];

export const STATUS_LAPORAN = [
  { id: "draft", label: "Draft", tone: "abu" },
  { id: "baru", label: "Menunggu", tone: "kuning" },
  { id: "diproses", label: "Diproses", tone: "biru" },
  { id: "selesai", label: "Selesai", tone: "hijau" },
  { id: "ditolak", label: "Ditolak", tone: "merah" },
];

export const KATEGORI_ALAT = [
  "Komputer",
  "Laptop",
  "Monitor",
  "Proyektor",
  "Jaringan",
  "Printer",
  "AC",
  "Perabot",
  "Lainnya",
];

export const KATEGORI_KERUSAKAN = [
  "Perangkat keras",
  "Perangkat lunak",
  "Jaringan",
  "Listrik",
  "Layar / tampilan",
  "Lainnya",
];

export const JENIS_PERAWATAN = [
  "Pembersihan",
  "Pengecekan berkala",
  "Servis",
  "Kalibrasi",
  "Pembaruan perangkat lunak",
  "Lainnya",
];

export const ULANGAN = [
  { id: "tidak", label: "Tidak berulang" },
  { id: "mingguan", label: "Mingguan" },
  { id: "bulanan", label: "Bulanan" },
  { id: "3_bulan", label: "Tiap 3 bulan" },
  { id: "6_bulan", label: "Tiap 6 bulan" },
  { id: "tahunan", label: "Tahunan" },
];

export const ROLES = [
  { id: "admin", label: "Admin" },
  { id: "petugas", label: "Petugas Lab" },
  { id: "guru", label: "Guru" },
];

export function labelOf(list, id) {
  const found = list.find((x) => x.id === id);
  return found ? found.label : id;
}

export function toneOf(list, id) {
  const found = list.find((x) => x.id === id);
  return found ? found.tone : "abu";
}
