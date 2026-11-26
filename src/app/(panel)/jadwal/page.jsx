import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { PageHead } from "@/components/ui";
import { IconPlus } from "@/components/icons";
import JadwalClient from "@/components/JadwalClient";

export default async function JadwalPage() {
  const user = await getCurrentUser();
  const [schedules, equipment, rooms] = await Promise.all([
    db.list("schedules"),
    db.list("equipment"),
    db.list("rooms"),
  ]);
  const bisaKelola = ["admin", "petugas"].includes(user.role);
  return (
    <>
      <PageHead judul="Jadwal Perawatan" sub="Perawatan berkala agar peralatan lab selalu siap dipakai">
        {bisaKelola ? (
          <Link href="/jadwal/baru" className="btn">
            <IconPlus size={18} /> Buat Jadwal
          </Link>
        ) : null}
      </PageHead>
      <JadwalClient schedules={schedules} equipment={equipment} rooms={rooms} bisaKelola={bisaKelola} />
    </>
  );
}
