import { db } from "@/lib/db";
import { PageHead } from "@/components/ui";
import FormLaporan from "@/components/forms/FormLaporan";
import { EmptyState } from "@/components/ui";
import { IconPeralatan } from "@/components/icons";

export default async function LaporanBaruPage({ searchParams }) {
  const { alat } = await searchParams;
  const [equipment, rooms] = await Promise.all([db.list("equipment"), db.list("rooms")]);
  const aktif = equipment.filter((a) => a.aktif);
  return (
    <>
      <PageHead judul="Buat Laporan Kerusakan" sub="Laporan langsung masuk ke antrian petugas lab" />
      {aktif.length === 0 ? (
        <EmptyState
          ikon={<IconPeralatan size={26} />}
          judul="Belum ada peralatan terdaftar"
          teks="Laporan kerusakan membutuhkan data peralatan. Minta petugas lab menambahkan peralatan lebih dulu."
        />
      ) : (
        <FormLaporan equipment={aktif} rooms={rooms} alatAwal={alat || ""} />
      )}
    </>
  );
}
