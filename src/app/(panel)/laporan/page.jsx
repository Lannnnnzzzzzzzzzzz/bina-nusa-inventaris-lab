import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { PageHead } from "@/components/ui";
import { IconPlus } from "@/components/icons";
import LaporanClient from "@/components/LaporanClient";

export default async function LaporanPage() {
  const user = await getCurrentUser();
  let reports = await db.list("reports");
  if (user.role === "guru") reports = reports.filter((r) => r.pelapor_id === user.id);
  const [equipment, users] = await Promise.all([db.list("equipment"), db.list("users")]);
  const terbuka = reports.filter((r) => ["baru", "diproses"].includes(r.status)).length;
  return (
    <>
      <PageHead judul="Laporan Kerusakan" sub={`${terbuka} laporan masih terbuka dan menunggu ditangani`}>
        <Link href="/laporan/baru" className="btn">
          <IconPlus size={18} /> Buat Laporan
        </Link>
      </PageHead>
      <LaporanClient reports={reports} equipment={equipment} users={users} />
    </>
  );
}
