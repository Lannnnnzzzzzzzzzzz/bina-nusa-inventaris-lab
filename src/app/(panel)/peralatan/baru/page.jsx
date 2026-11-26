import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { PageHead } from "@/components/ui";
import FormPeralatan from "@/components/forms/FormPeralatan";

export default async function PeralatanBaruPage() {
  const user = await getCurrentUser();
  if (!["admin", "petugas"].includes(user.role)) redirect("/peralatan");
  const rooms = await db.list("rooms");
  return (
    <>
      <PageHead judul="Tambah Peralatan" sub="Kode inventaris dibuat otomatis oleh sistem" />
      <FormPeralatan rooms={rooms} />
    </>
  );
}
