# Perawatan Lab SMK Bina Nusa

Aplikasi web perawatan laboratorium SMK Bina Nusa Bekasi: inventaris peralatan,
laporan kerusakan berfoto, jadwal perawatan berulang, riwayat perawatan, dan
rekap ekspor CSV. Ditulis ulang ke JavaScript (Next.js + Supabase) dari fitur
aplikasi referensi berbasis Laravel, dengan tampilan mengikuti desain Figma
SMK Bina Nusa dan responsif untuk HP, tablet, dan komputer.

## Menjalankan

```
npm install
npm run build
npm start
```

Salin `.env.example` menjadi `.env.local` dan isi akun admin pertama sebelum
menjalankan. Tanpa kunci Supabase, aplikasi berjalan dalam Mode Lokal
(data di `data/lab.json`). Panduan lengkap ada di `PANDUAN.md`, skema database
produksi ada di `supabase/schema.sql`.

## Peran

- **Admin**: kelola ruangan, pengguna, dan verifikasi pendaftaran.
- **Petugas Lab**: kelola peralatan dan jadwal, memproses laporan kerusakan.
- **Guru**: membuat laporan kerusakan dan memantau statusnya.

Lisensi MIT.
