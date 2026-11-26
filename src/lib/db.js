import { createClient } from "@supabase/supabase-js";
import { local } from "./localstore";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const MODE_SUPABASE = Boolean(url && serviceKey);
const sb = MODE_SUPABASE ? createClient(url, serviceKey, { auth: { persistSession: false } }) : null;

const TABEL = {
  users: "lab_users",
  rooms: "lab_rooms",
  equipment: "lab_equipment",
  reports: "lab_reports",
  schedules: "lab_schedules",
  logs: "lab_logs",
};

async function sbList(coll, eq = {}) {
  let q = sb.from(TABEL[coll]).select("*").order("created_at", { ascending: false });
  for (const [k, v] of Object.entries(eq)) if (v !== undefined) q = q.eq(k, v);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data || [];
}

async function sbGet(coll, id) {
  const { data, error } = await sb.from(TABEL[coll]).select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data || null;
}

async function sbInsert(coll, data) {
  const bersih = { ...data };
  delete bersih.id;
  delete bersih.created_at;
  delete bersih.updated_at;
  const { data: row, error } = await sb.from(TABEL[coll]).insert(bersih).select().single();
  if (error) throw new Error(error.message);
  return row;
}

async function sbUpdate(coll, id, patch) {
  const bersih = { ...patch };
  delete bersih.id;
  delete bersih.created_at;
  const { data: row, error } = await sb
    .from(TABEL[coll])
    .update(bersih)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return row;
}

async function sbRemove(coll, id) {
  const { error } = await sb.from(TABEL[coll]).delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}

export const db = {
  async list(coll, eq = {}) {
    return MODE_SUPABASE ? sbList(coll, eq) : local.list(coll, eq);
  },
  async get(coll, id) {
    return MODE_SUPABASE ? sbGet(coll, id) : local.get(coll, id);
  },
  async insert(coll, data) {
    return MODE_SUPABASE ? sbInsert(coll, data) : local.insert(coll, data);
  },
  async update(coll, id, patch) {
    return MODE_SUPABASE ? sbUpdate(coll, id, patch) : local.update(coll, id, patch);
  },
  async remove(coll, id) {
    return MODE_SUPABASE ? sbRemove(coll, id) : local.remove(coll, id);
  },
  async findUserByEmail(email) {
    const rows = await this.list("users", { email: String(email || "").toLowerCase().trim() });
    return rows[0] || null;
  },
};

export function tanpaSandi(user) {
  if (!user) return null;
  const { password_hash, ...aman } = user;
  return aman;
}
