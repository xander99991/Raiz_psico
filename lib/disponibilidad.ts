// Cálculo de horarios libres (solo servidor)
import { q, type Bloqueo, BLOQUEO_COLS } from './db';
import { hoursFor, isTooFar, isTooSoon, monthDates, psicologosPara, slotKey, toDate } from './agenda';
import type { Modalidad } from './equipo';

/** Para cada hora de atención: qué psicólogos siguen libres (vacío = ocupado) */
export type DiaDisponible = { hour: string; psychologists: string[] }[];

const estaBloqueado = (bloqueos: Bloqueo[], pid: string, date: string, hour: string) =>
  bloqueos.some((b) => (b.psychologistId === 'todos' || b.psychologistId === pid) && b.date === date && (!b.hour || b.hour === hour));

/** Devuelve, para cada día del mes, las horas de atención y qué psicólogos están libres. */
export async function disponibilidadMes(month: string, psychologistId: string, modalidad?: Modalidad) {
  const dates = monthDates(month);
  const from = toDate(dates[0], '00:00');
  const to = toDate(dates[dates.length - 1], '23:59');
  const candidatos = psicologosPara(psychologistId, modalidad);

  const [ocupados, bloqueos] = await Promise.all([
    q<{ slotKey: string }>(`SELECT slot_key AS "slotKey" FROM appointments WHERE start BETWEEN $1 AND $2 AND slot_key IS NOT NULL`, [from, to]),
    q<Bloqueo>(`SELECT ${BLOQUEO_COLS} FROM blocked_slots WHERE date BETWEEN $1 AND $2`, [dates[0], dates[dates.length - 1]]),
  ]);
  const ocupadosSet = new Set(ocupados.map((o) => o.slotKey));

  const now = new Date();
  const result: Record<string, { total: number; horas: DiaDisponible }> = {};
  for (const date of dates) {
    const porHora = new Map<string, string[]>();
    let total = 0;
    if (!isTooFar(date, now)) {
      for (const p of candidatos) {
        for (const hour of hoursFor(p, date)) {
          if (isTooSoon(date, hour, now)) continue;
          total++;
          if (!porHora.has(hour)) porHora.set(hour, []);
          if (ocupadosSet.has(slotKey(p.id, date, hour)) || estaBloqueado(bloqueos, p.id, date, hour)) continue;
          porHora.get(hour)!.push(p.id);
        }
      }
    }
    const horas = [...porHora.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([hour, psychologists]) => ({ hour, psychologists }));
    result[date] = { total, horas };
  }
  return result;
}

/** ¿Hay un bloqueo manual para ese psicólogo, día y hora? */
export async function horarioBloqueado(psychologistId: string, date: string, hour: string) {
  const b = await q<Bloqueo>(`SELECT ${BLOQUEO_COLS} FROM blocked_slots WHERE date = $1 AND psychologist_id IN ($2, 'todos')`, [date, psychologistId]);
  return estaBloqueado(b, psychologistId, date, hour);
}
