import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { PageHead } from "@/components/ui";
import FormJadwal from "@/components/forms/FormJadwal";

export default async function JadwalBaruPage() {
  const user = await getCurrentUser();
  if (!["admin", "petugas"].includes(user.role)) redirect("/jadwal");
  const [equipment, rooms] = await Promise.all([db.list("equipment"), db.list("rooms")]);
  return (
    <>
      <PageHead judul="Buat Jadwal Perawatan" sub="Jadwal muncul di dashboard saat tanggalnya mendekat" />
      <FormJadwal equipment={equipment.filter((a) => a.aktif)} rooms={rooms} />
    </>
  );
}
