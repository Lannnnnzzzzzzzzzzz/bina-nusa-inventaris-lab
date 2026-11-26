import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { PageHead } from "@/components/ui";
import FormPeralatan from "@/components/forms/FormPeralatan";

export default async function PeralatanUbahPage({ params }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!["admin", "petugas"].includes(user.role)) redirect("/peralatan");
  const alat = await db.get("equipment", id);
  if (!alat) notFound();
  const rooms = await db.list("rooms");
  return (
    <>
      <PageHead judul={`Ubah ${alat.nama}`} sub={`Kode inventaris ${alat.kode} tidak berubah`} />
      <FormPeralatan rooms={rooms} awal={alat} />
    </>
  );
}
