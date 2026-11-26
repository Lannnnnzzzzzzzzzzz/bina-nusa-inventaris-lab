import { getCurrentUser } from "@/lib/auth";
import { PageHead } from "@/components/ui";
import ProfilClient from "@/components/ProfilClient";

export default async function ProfilPage() {
  const user = await getCurrentUser();
  return (
    <>
      <PageHead judul="Profil Saya" sub="Kelola nama, foto profil, dan kata sandi Anda" />
      <ProfilClient user={user} />
    </>
  );
}
