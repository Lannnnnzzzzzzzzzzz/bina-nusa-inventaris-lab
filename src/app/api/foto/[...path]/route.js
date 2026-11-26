import fs from "node:fs";
import path from "node:path";

const TIPE = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(req, { params }) {
  const { path: bagian } = await params;
  const aman = (bagian || []).every((s) => /^[a-zA-Z0-9._-]+$/.test(s) && !s.startsWith("."));
  if (!aman || bagian.length < 2)
    return new Response("Tidak ditemukan", { status: 404 });
  const file = path.join(process.cwd(), "data", "uploads", ...bagian);
  const ext = path.extname(file).toLowerCase();
  if (!TIPE[ext] || !fs.existsSync(file))
    return new Response("Tidak ditemukan", { status: 404 });
  const buffer = fs.readFileSync(file);
  return new Response(buffer, {
    headers: {
      "Content-Type": TIPE[ext],
      "Cache-Control": "public, max-age=86400",
    },
  });
}
