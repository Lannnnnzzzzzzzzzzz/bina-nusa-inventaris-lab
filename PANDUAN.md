# Panduan Perawatan Lab SMK Bina Nusa

Aplikasi web perawatan laboratorium untuk guru dan petugas lab SMK Bina Nusa Bekasi.
Dibangun dengan Next.js + Supabase, meniru fitur aplikasi referensi berbasis Laravel
(reservasi dan pelaporan fasilitas kampus) yang ditulis ulang ke JavaScript dan
disesuaikan untuk kebutuhan perawatan lab.

## Fitur

- **Dashboard**: ringkasan total peralatan, kondisi baik, jadwal bulan ini, laporan
  terbuka, jadwal terdekat, laporan terbaru, dan grafik kondisi per ruangan.
- **Peralatan**: inventaris per ruangan dengan foto, kode inventaris otomatis
  (BNL-0001, BNL-0002, dan seterusnya), kategori, dan kondisi
  (Baik / Rusak Ringan / Rusak Berat / Dalam Perbaikan).
- **Laporan Kerusakan**: guru melaporkan kerusakan dengan kategori, deskripsi, dan
  foto. Bisa disimpan sebagai draft dulu. Alur status: Menunggu, Diproses, Selesai,
  Ditolak. Saat petugas mulai memproses, kondisi alat otomatis menjadi
  Dalam Perbaikan. Saat laporan ditandai selesai, kondisi alat mengikuti pilihan
  petugas dan riwayat perawatan tercatat otomatis.
- **Jadwal Perawatan**: jadwal per ruangan atau per alat, bisa berulang
  (mingguan, bulanan, 3 bulan, 6 bulan, tahunan). Jadwal yang ditandai selesai
  masuk riwayat dan jadwal berikutnya dibuat otomatis.
- **Catat & Riwayat Perawatan**: pencatatan manual perawatan termasuk biaya,
  lengkap dengan riwayat gabungan dari jadwal, laporan, dan catatan manual.
- **Rekap & Ekspor**: ringkasan per kondisi dan status, peralatan paling sering
  dilaporkan, total biaya, unduh CSV (peralatan, laporan, riwayat), dan cetak PDF
  lewat tombol Cetak.
- **Pengguna & Peran**: Admin (kelola semua, verifikasi pendaftaran, kelola
  ruangan), Petugas Lab (proses laporan, kelola peralatan dan jadwal), Guru
  (membuat laporan). Pendaftaran mandiri harus diverifikasi admin sebelum aktif.
- **Responsif**: tampilan menyesuaikan HP (navigasi bawah), tablet, dan komputer
  (sidebar), mengikuti desain Figma SMK Bina Nusa (biru #0B5FA5).

## Dua Mode Penyimpanan

1. **Mode Lokal (tanpa Supabase)**: data tersimpan di berkas `data/lab.json` dan
   foto di `data/uploads/` pada komputer yang menjalankan aplikasi. Cocok untuk
   mencoba dan untuk pemakaian di satu komputer lab.
2. **Mode Supabase (produksi)**: data di PostgreSQL Supabase dan foto di Supabase
   Storage. Wajib dipakai bila aplikasi dipasang di Vercel atau diakses banyak
   perangkat, karena penyimpanan lokal di server online tidak permanen.

Mode dipilih otomatis: bila `NEXT_PUBLIC_SUPABASE_URL` dan
`SUPABASE_SERVICE_ROLE_KEY` terisi, aplikasi memakai Supabase. Bila kosong,
aplikasi memakai Mode Lokal.

## Cara Menjalankan di Komputer Sendiri (Mode Lokal)

Syarat: Node.js versi 20 atau lebih baru.

1. Salin `.env.example` menjadi `.env.local`, lalu isi:
   - `LAB_ADMIN_EMAIL`, `LAB_ADMIN_PASSWORD` (minimal 8 karakter), dan
     `LAB_ADMIN_NAMA` untuk akun admin pertama.
   - `LAB_SESSION_SECRET` dengan teks acak yang panjang.
2. Jalankan perintah berikut di folder aplikasi:

   ```
   npm install
   npm run build
   npm start
   ```

   Untuk pengembangan, `npm run dev` bisa dipakai sebagai ganti dua perintah
   terakhir.
3. Buka `http://localhost:3000`, masuk dengan email dan kata sandi admin dari
   `.env.local`.
4. Langkah awal di dalam aplikasi:
   - Menu **Pengaturan**: tambahkan ruangan (misalnya Lab Komputer 1 dan
     Lab Komputer 2).
   - Menu **Pengaturan**: buat akun Petugas Lab.
   - Menu **Peralatan**: tambahkan peralatan lab satu per satu.

Akun admin pertama hanya dibuat sekali, saat belum ada pengguna sama sekali.
Setelah masuk, ganti kata sandinya lewat menu Profil.

## Cara Memasang Supabase (Mode Produksi)

1. Buat project baru di https://supabase.com (gratis).
2. Buka menu **SQL Editor**, tempel seluruh isi berkas `supabase/schema.sql`,
   lalu jalankan. Ini membuat 6 tabel `lab_` dan bucket Storage bernama `foto`.
3. Buka menu **Project Settings, API**, salin **Project URL** dan
   **service_role key**.
4. Isi di `.env.local` (atau di Environment Variables Vercel):

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

5. Jalankan ulang aplikasi. Data lama di Mode Lokal tidak ikut pindah otomatis;
   mulai dari akun admin bootstrap seperti langkah Mode Lokal.

Catatan keamanan: `service_role key` bersifat rahasia, hanya dipakai di server.
Jangan pernah membagikan kunci ini atau menaruhnya di kode sisi browser.

## Cara Deploy ke Vercel

1. Unggah folder aplikasi ini ke GitHub (tanpa `node_modules`, `.next`, `data`,
   dan `.env.local`; daftar abaikan sudah ada di `.gitignore`).
2. Di Vercel, Import project dari repo tersebut. Framework terdeteksi otomatis
   sebagai Next.js.
3. Di **Settings, Environment Variables**, isi semua variabel dari `.env.example`
   termasuk dua variabel Supabase (wajib, lihat catatan Mode Lokal di atas).
4. Deploy. Setiap push ke GitHub akan membangun ulang otomatis.

## Struktur Folder Singkat

- `src/app/` halaman dan API (App Router Next.js)
- `src/lib/db.js` lapisan data (Supabase atau lokal, antarmuka sama)
- `src/lib/auth.js` kata sandi ter-hash (scrypt) dan sesi login bertanda tangan
- `src/lib/photos.js` unggah foto (Supabase Storage atau lokal)
- `supabase/schema.sql` skema database produksi
- `data/` data Mode Lokal (dibuat otomatis, tidak perlu diedit manual)

## Lisensi

MIT. Silakan dipakai dan diubah untuk kebutuhan sekolah.
