import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import FormDaftar from "@/components/forms/FormDaftar";

export default async function DaftarPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-brand">
          <img src="/logo.png" alt="Logo SMK Bina Nusa" />
          <h1>Daftar Akun Guru</h1>
          <p>Akun aktif setelah diverifikasi oleh admin lab.</p>
        </div>
        <FormDaftar />
      </div>
    </div>
  );
}
