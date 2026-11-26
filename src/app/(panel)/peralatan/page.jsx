import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { PageHead } from "@/components/ui";
import { IconPlus } from "@/components/icons";
import PeralatanClient from "@/components/PeralatanClient";

export default async function PeralatanPage() {
  const user = await getCurrentUser();
  const [equipment, rooms] = await Promise.all([db.list("equipment"), db.list("rooms")]);
  const bisaTambah = ["admin", "petugas"].includes(user.role);
  return (
    <>
      <PageHead judul="Peralatan Lab" sub={`${equipment.length} peralatan terdaftar di semua ruangan`}>
        {bisaTambah ? (
          <Link href="/peralatan/baru" className="btn">
            <IconPlus size={18} /> Tambah Peralatan
          </Link>
        ) : null}
      </PageHead>
      <PeralatanClient equipment={equipment} rooms={rooms} />
    </>
  );
}
