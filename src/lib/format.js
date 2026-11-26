const fmtPanjang = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const fmtSedang = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const fmtBulan = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" });

export function fmtTanggal(iso) {
  if (!iso) return "-";
  const d = new Date(iso.length <= 10 ? iso + "T00:00:00" : iso);
  return Number.isNaN(d.getTime()) ? "-" : fmtPanjang.format(d);
}

export function fmtTanggalSingkat(iso) {
  if (!iso) return "-";
  const d = new Date(iso.length <= 10 ? iso + "T00:00:00" : iso);
  return Number.isNaN(d.getTime()) ? "-" : fmtSedang.format(d);
}

export function namaBulanIni() {
  return fmtBulan.format(new Date());
}

export function hariIni() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function tambahHari(isoDate, jumlah) {
  const d = new Date(isoDate + "T00:00:00");
  d.setDate(d.getDate() + jumlah);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function tanggalBerikutnya(isoDate, ulangan) {
  const d = new Date(isoDate + "T00:00:00");
  if (ulangan === "mingguan") d.setDate(d.getDate() + 7);
  else if (ulangan === "bulanan") d.setMonth(d.getMonth() + 1);
  else if (ulangan === "3_bulan") d.setMonth(d.getMonth() + 3);
  else if (ulangan === "6_bulan") d.setMonth(d.getMonth() + 6);
  else if (ulangan === "tahunan") d.setFullYear(d.getFullYear() + 1);
  else return null;
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function statusJadwalEfektif(jadwal) {
  if (jadwal.status === "selesai") return "selesai";
  if (jadwal.tanggal < hariIni()) return "terlewat";
  return "terjadwal";
}

export function labelJadwalEfektif(jadwal) {
  const s = statusJadwalEfektif(jadwal);
  if (s === "selesai") return { label: "Selesai", tone: "hijau" };
  if (s === "terlewat") return { label: "Terlewat", tone: "merah" };
  if (jadwal.tanggal === hariIni()) return { label: "Hari ini", tone: "kuning" };
  if (jadwal.tanggal === tambahHari(hariIni(), 1)) return { label: "Besok", tone: "kuning" };
  return { label: "Terjadwal", tone: "biru" };
}

export function fmtRupiah(n) {
  if (n === null || n === undefined || n === "") return "-";
  return "Rp " + Number(n).toLocaleString("id-ID");
}

export function toCSV(headers, rows) {
  const esc = (v) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const lines = [headers.map(esc).join(";")];
  for (const r of rows) lines.push(r.map(esc).join(";"));
  return "\ufeff" + lines.join("\r\n");
}
