// Conexión a PostgreSQL. Las tablas se crean solas la primera vez.
import { Pool } from 'pg';

const globalForDb = globalThis as unknown as { pool?: Pool; ready?: Promise<void> };

/** Limpia la dirección por si se pegó con texto de más (DATABASE_URL=, psql, comillas, espacios) */
export function limpiarUrl(raw = process.env.DATABASE_URL ?? '') {
  const m = raw.match(/postgres(?:ql)?:\/\/[^\s'"`]+/);
  const url = m ? m[0] : raw.trim();
  // node-postgres no necesita channel_binding; lo quitamos para evitar incompatibilidades
  return url.replace(/[?&]channel_binding=[^&]*/g, (x) => (x.startsWith('?') ? '?' : '')).replace(/\?&/, '?').replace(/\?$/, '');
}

export const pool =
  globalForDb.pool ??
  new Pool({ connectionString: limpiarUrl(), max: 5, idleTimeoutMillis: 10_000 });
if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS appointments (
  id              TEXT PRIMARY KEY,
  psychologist_id TEXT NOT NULL,
  start           TIMESTAMPTZ NOT NULL,
  slot_key        TEXT UNIQUE,            -- "psicologo|fechaThora" mientras está activo; NULL si se cancela
  modality        TEXT NOT NULL,
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT NOT NULL,
  reason          TEXT,
  tier            TEXT NOT NULL,
  price           INTEGER NOT NULL,
  answers         JSONB,
  status          TEXT NOT NULL DEFAULT 'pendiente',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS appointments_start_idx ON appointments (start);
CREATE TABLE IF NOT EXISTS blocked_slots (
  id              TEXT PRIMARY KEY,
  psychologist_id TEXT NOT NULL,          -- id del psicólogo o 'todos'
  date            TEXT NOT NULL,          -- AAAA-MM-DD (hora de Ecuador)
  hour            TEXT,                   -- HH:MM; NULL = todo el día
  reason          TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS blocked_slots_date_idx ON blocked_slots (date);
`;

export function ensureSchema() {
  if (!globalForDb.ready) {
    globalForDb.ready = pool.query(SCHEMA).then(() => undefined).catch((e) => {
      globalForDb.ready = undefined;
      throw e;
    });
  }
  return globalForDb.ready;
}

export async function q<T = Record<string, unknown>>(text: string, params: unknown[] = []) {
  await ensureSchema();
  const r = await pool.query(text, params);
  return r.rows as T[];
}

export type Turno = {
  id: string;
  psychologistId: string;
  start: string;
  slotKey: string | null;
  modality: string;
  name: string;
  email: string;
  phone: string;
  reason: string | null;
  tier: string;
  price: number;
  status: string;
  createdAt: string;
};

export const TURNO_COLS = `id, psychologist_id AS "psychologistId", start, slot_key AS "slotKey", modality, name, email, phone, reason, tier, price, status, created_at AS "createdAt"`;

export type Bloqueo = { id: string; psychologistId: string; date: string; hour: string | null; reason: string | null };
export const BLOQUEO_COLS = `id, psychologist_id AS "psychologistId", date, hour, reason`;

/** Código de error de Postgres para "valor duplicado" (horario ya tomado) */
export const isUniqueViolation = (e: unknown) => (e as { code?: string })?.code === '23505';
