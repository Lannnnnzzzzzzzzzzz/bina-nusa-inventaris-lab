import { db } from "@/lib/db";
import { simpanFoto } from "@/lib/photos";
import { gagal, teks, wajibUser } from "@/lib/api";

async function kodeBaru() {
  const semua = await db.list("equipment");
  let n = semua.length + 1;
  const terpakai = new Set(semua.map((a) => a.kode));
  let kode = `BNL-${String(n).padStart(4, "0")}`;
  while (terpakai.has(kode)) {
    n += 1;
    kode = `BNL-${String(n).padStart(4, "0")}`;
  }
  return kode;
}

export async function POST(req) {
  const { error } = await wajibUser(["admin", "petugas"]);
  if (error) return error;
  try {
    const form = await req.formData();
    const nama = teks(form, "nama");
    if (!nama) return gagal(400, "Nama peralatan wajib diisi.");
    let foto_url = null;
    const foto = form.get("foto");
    if (foto && foto.size > 0) foto_url = await simpanFoto(foto, "peralatan");
    const row = await db.insert("equipment", {
      kode: await kodeBaru(),
      nama,
      kategori: teks(form, "kategori") || "Lainnya",
      room_id: teks(form, "room_id") || null,
      kondisi: teks(form, "kondisi") || "baik",
      aktif: true,
      foto_url,
      catatan: teks(form, "catatan") || null,
    });
    return Response.json({ equipment: row });
  } catch (e) {
    return gagal(500, e.message);
  }
}

export async function PATCH(req) {
  const { error } = await wajibUser(["admin", "petugas"]);
  if (error) return error;
  try {
    const form = await req.formData();
    const id = teks(form, "id");
    const lama = await db.get("equipment", id);
    if (!lama) return gagal(404, "Peralatan tidak ditemukan.");
    const patch = {
      nama: teks(form, "nama") || lama.nama,
      kategori: teks(form, "kategori") || lama.kategori,
      room_id: teks(form, "room_id") || null,
      kondisi: teks(form, "kondisi") || lama.kondisi,
      catatan: teks(form, "catatan") || null,
    };
    const foto = form.get("foto");
    if (foto && foto.size > 0) patch.foto_url = await simpanFoto(foto, "peralatan");
    if (form.get("aktif") !== null) patch.aktif = teks(form, "aktif") === "true";
    const row = await db.update("equipment", id, patch);
    return Response.json({ equipment: row });
  } catch (e) {
    return gagal(500, e.message);
  }
}

export async function DELETE(req) {
  const { error } = await wajibUser(["admin"]);
  if (error) return error;
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return gagal(400, "ID peralatan tidak ada.");
    await db.remove("equipment", id);
    return Response.json({ ok: true });
  } catch (e) {
    return gagal(500, e.message);
  }
}
