import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { PageHead } from "@/components/ui";
import FormCatat from "@/components/forms/FormCatat";

export default async function CatatPage() {
  const user = await getCurrentUser();
  if (!["admin", "petugas"].includes(user.role)) redirect("/riwayat");
  const [equipment, rooms] = await Promise.all([db.list("equipment"), db.list("rooms")]);
  return (
    <>
      <PageHead judul="Catat Perawatan" sub="Catatan masuk ke riwayat perawatan dan halaman detail peralatan" />
      <FormCatat equipment={equipment.filter((a) => a.aktif)} rooms={rooms} />
    </>
  );
}
