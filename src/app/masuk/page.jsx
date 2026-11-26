import { redirect } from "next/navigation";
import { bootstrapAdmin, getCurrentUser } from "@/lib/auth";
import FormMasuk from "@/components/forms/FormMasuk";

export default async function MasukPage() {
  await bootstrapAdmin();
  const user = await getCurrentUser();
  if (user) redirect("/");
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-brand">
          <img src="/logo.png" alt="Logo SMK Bina Nusa" />
          <h1>Perawatan Laboratorium</h1>
          <p>SMK Bina Nusa Bekasi. Masuk untuk melanjutkan.</p>
        </div>
        <FormMasuk />
      </div>
    </div>
  );
}
