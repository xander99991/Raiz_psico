import { NextRequest, NextResponse } from 'next/server';
import { q, isUniqueViolation, TURNO_COLS, type Turno } from '@/lib/db';
import { isAdmin } from '@/lib/admin';
import { slotKey } from '@/lib/agenda';

export const dynamic = 'force-dynamic';
const ESTADOS = ['pendiente', 'confirmada', 'cancelada', 'atendida'];

export async function GET(req: NextRequest) {
  if (!isAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const todos = req.nextUrl.searchParams.get('scope') === 'todos';
  const turnos = todos
    ? await q<Turno>(`SELECT ${TURNO_COLS} FROM appointments ORDER BY start DESC LIMIT 1000`)
    : await q<Turno>(`SELECT ${TURNO_COLS} FROM appointments WHERE start >= now() - interval '2 hours' ORDER BY start ASC LIMIT 1000`);
  return NextResponse.json({ turnos });
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const { id, status } = await req.json();
  if (!ESTADOS.includes(status)) return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
  const [turno] = await q<Turno>(`SELECT ${TURNO_COLS} FROM appointments WHERE id = $1`, [id]);
  if (!turno) return NextResponse.json({ error: 'No existe' }, { status: 404 });

  // Cancelar libera el horario; reactivar lo vuelve a ocupar (si sigue libre)
  let key: string | null = turno.slotKey;
  if (status === 'cancelada') key = null;
  else if (!key) {
    const ec = new Date(new Date(turno.start).getTime() - 5 * 3600e3).toISOString();
    key = slotKey(turno.psychologistId, ec.slice(0, 10), ec.slice(11, 16));
  }
  try {
    const [actualizado] = await q<Turno>(
      `UPDATE appointments SET status = $2, slot_key = $3, updated_at = now() WHERE id = $1 RETURNING ${TURNO_COLS}`,
      [id, status, key],
    );
    return NextResponse.json({ turno: actualizado });
  } catch (e) {
    if (isUniqueViolation(e)) return NextResponse.json({ error: 'Ese horario ya fue tomado por otra persona' }, { status: 409 });
    throw e;
  }
}
