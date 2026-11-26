import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const FILE = path.join(process.cwd(), "data", "lab.json");
const KOSONG = { users: [], rooms: [], equipment: [], reports: [], schedules: [], logs: [] };

function muat() {
  if (globalThis.__labStore) return globalThis.__labStore;
  let data = { ...KOSONG };
  try {
    if (fs.existsSync(FILE)) data = { ...KOSONG, ...JSON.parse(fs.readFileSync(FILE, "utf8")) };
  } catch {
    data = { ...KOSONG };
  }
  globalThis.__labStore = data;
  return data;
}

function simpan() {
  const data = muat();
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  const tmp = FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 1));
  fs.renameSync(tmp, FILE);
}

export const local = {
  list(coll, eq = {}) {
    const rows = muat()[coll].filter((r) =>
      Object.entries(eq).every(([k, v]) => v === undefined || r[k] === v)
    );
    return rows.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  },
  get(coll, id) {
    return muat()[coll].find((r) => r.id === id) || null;
  },
  insert(coll, data) {
    const row = { id: randomUUID(), created_at: new Date().toISOString(), ...data };
    if (row.updated_at === undefined && coll !== "logs") row.updated_at = row.created_at;
    muat()[coll].push(row);
    simpan();
    return row;
  },
  update(coll, id, patch) {
    const row = muat()[coll].find((r) => r.id === id);
    if (!row) return null;
    Object.assign(row, patch);
    if ("updated_at" in row || coll !== "logs") row.updated_at = new Date().toISOString();
    simpan();
    return row;
  },
  remove(coll, id) {
    const arr = muat()[coll];
    const idx = arr.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    arr.splice(idx, 1);
    simpan();
    return true;
  },
};
