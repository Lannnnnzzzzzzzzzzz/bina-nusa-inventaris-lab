-- Skema database Perawatan Lab SMK Bina Nusa
-- Jalankan file ini di Supabase: menu SQL Editor, tempel, Run.
-- Semua tabel memakai awalan lab_ agar aman berbagi project dengan aplikasi lain.
-- Akses data dilakukan dari server aplikasi memakai service role key.
-- RLS diaktifkan tanpa policy publik: akses langsung dari browser ditolak.

create extension if not exists pgcrypto;

create table if not exists public.lab_users (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  email text not null unique,
  password_hash text not null,
  role text not null default 'guru' check (role in ('admin', 'petugas', 'guru')),
  status text not null default 'pending' check (status in ('aktif', 'pending', 'nonaktif')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lab_rooms (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.lab_equipment (
  id uuid primary key default gen_random_uuid(),
  kode text not null unique,
  nama text not null,
  kategori text,
  room_id uuid references public.lab_rooms (id) on delete set null,
  kondisi text not null default 'baik'
    check (kondisi in ('baik', 'rusak_ringan', 'rusak_berat', 'dalam_perbaikan')),
  aktif boolean not null default true,
  foto_url text,
  catatan text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lab_reports (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid not null references public.lab_equipment (id) on delete cascade,
  pelapor_id uuid references public.lab_users (id) on delete set null,
  kategori text,
  deskripsi text not null,
  foto_url text,
  status text not null default 'baru'
    check (status in ('draft', 'baru', 'diproses', 'selesai', 'ditolak')),
  catatan_resolusi text,
  kondisi_akhir text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lab_schedules (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid references public.lab_equipment (id) on delete set null,
  room_id uuid references public.lab_rooms (id) on delete set null,
  judul text not null,
  jenis text,
  tanggal date not null,
  ulangan text not null default 'tidak',
  status text not null default 'terjadwal' check (status in ('terjadwal', 'selesai')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lab_logs (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid references public.lab_equipment (id) on delete set null,
  schedule_id uuid references public.lab_schedules (id) on delete set null,
  petugas_id uuid references public.lab_users (id) on delete set null,
  tanggal date not null,
  jenis text,
  deskripsi text,
  biaya numeric,
  kondisi_setelah text,
  created_at timestamptz not null default now()
);

alter table public.lab_users enable row level security;
alter table public.lab_rooms enable row level security;
alter table public.lab_equipment enable row level security;
alter table public.lab_reports enable row level security;
alter table public.lab_schedules enable row level security;
alter table public.lab_logs enable row level security;

-- Bucket penyimpanan foto (foto peralatan, foto kerusakan, avatar)
insert into storage.buckets (id, name, public)
values ('foto', 'foto', true)
on conflict (id) do nothing;
