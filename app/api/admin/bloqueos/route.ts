import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { q, BLOQUEO_COLS, type Bloqueo } from '@/lib/db';
import { isAdmin } from '@/lib/admin';
import { todayEC } from '@/lib/agenda';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const bloqueos = await q<Bloqueo>(`SELECT ${BLOQUEO_COLS} FROM blocked_slots WHERE date >= $1 ORDER BY date, hour NULLS FIRST`, [todayEC()]);
  return NextResponse.json({ bloqueos });
}

export async function POST(req: NextRequest) {
  if (!isAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const { psychologistId, date, hour, reason } = await req.json();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: 'Fecha inválida' }, { status: 400 });
  if (hour && !/^\d{2}:\d{2}$/.test(hour)) return NextResponse.json({ error: 'Hora inválida' }, { status: 400 });
  const [bloqueo] = await q<Bloqueo>(
    `INSERT INTO blocked_slots (id, psychologist_id, date, hour, reason) VALUES ($1,$2,$3,$4,$5) RETURNING ${BLOQUEO_COLS}`,
    [randomUUID(), psychologistId || 'todos', date, hour || null, reason || null],
  );
  return NextResponse.json({ bloqueo }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 });
  await q(`DELETE FROM blocked_slots WHERE id = $1`, [id]);
  return NextResponse.json({ ok: true });
}
