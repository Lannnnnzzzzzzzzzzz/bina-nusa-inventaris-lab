import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AppShell from "@/components/AppShell";

export default async function PanelLayout({ children }) {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  return <AppShell user={user}>{children}</AppShell>;
}
