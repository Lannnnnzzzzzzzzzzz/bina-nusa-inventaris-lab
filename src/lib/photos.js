import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { MODE_SUPABASE } from "./db";

const EKSTENSI = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const MAKS = 5 * 1024 * 1024;

export async function simpanFoto(file, folder) {
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) return null;
  const ext = EKSTENSI.get(file.type);
  if (!ext) throw new Error("Format foto harus JPG, PNG, atau WebP.");
  if (file.size > MAKS) throw new Error("Ukuran foto maksimal 5 MB.");
  const nama = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (MODE_SUPABASE) {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    );
    const pathDiBucket = `${folder}/${nama}`;
    const { error } = await sb.storage.from("foto").upload(pathDiBucket, buffer, {
      contentType: file.type,
      upsert: false,
    });
    if (error) throw new Error("Gagal mengunggah foto: " + error.message);
    const { data } = sb.storage.from("foto").getPublicUrl(pathDiBucket);
    return data.publicUrl;
  }

  const dir = path.join(process.cwd(), "data", "uploads", folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, nama), buffer);
  return `/api/foto/${folder}/${nama}`;
}
