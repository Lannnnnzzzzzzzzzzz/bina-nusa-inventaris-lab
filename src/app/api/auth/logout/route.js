import { cookies } from "next/headers";
import { COOKIE_SESI } from "@/lib/auth";

export async function POST() {
  const jar = await cookies();
  jar.set(COOKIE_SESI, "", { httpOnly: true, path: "/", maxAge: 0 });
  return Response.json({ ok: true });
}
