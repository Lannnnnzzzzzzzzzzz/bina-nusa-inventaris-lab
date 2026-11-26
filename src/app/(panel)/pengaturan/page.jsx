import { redirect } from "next/navigation";
import { db, tanpaSandi } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { PageHead } from "@/components/ui";
import PengaturanClient from "@/components/PengaturanClient";

export default async function PengaturanPage() {
  const user = await getCurrentUser();
  if (user.role !== "admin") redirect("/");
  const [rooms, users] = await Promise.all([db.list("rooms"), db.list("users")]);
  return (
    <>
      <PageHead judul="Pengaturan" sub="Kelola ruangan lab, akun pengguna, dan verifikasi pendaftaran" />
      <PengaturanClient rooms={rooms} users={users.map(tanpaSandi)} userSaya={user.id} />
    </>
  );
}
