// Utilidades de fechas y horarios (zona horaria de Ecuador, UTC-5, sin horario de verano)
import { equipo, type Modalidad, type Psicologo } from './equipo';
import { site } from './site';

export const EC_OFFSET = '-05:00';

/** Convierte fecha "AAAA-MM-DD" + hora "HH:MM" (hora de Ecuador) a Date (UTC). */
export function toDate(date: string, hour: string) {
  return new Date(`${date}T${hour}:00${EC_OFFSET}`);
}

/** Fecha de hoy en Ecuador como "AAAA-MM-DD". */
export function todayEC(now = new Date()) {
  const ec = new Date(now.getTime() - 5 * 3600 * 1000);
  return ec.toISOString().slice(0, 10);
}

/** Día de la semana (0 = domingo … 6 = sábado) para una fecha "AAAA-MM-DD". */
export function weekday(date: string) {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}

export function addDays(date: string, days: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function daysInMonth(month: string) {
  const [y, m] = month.split('-').map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

export function monthDates(month: string) {
  return Array.from({ length: daysInMonth(month) }, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`);
}

export const slotKey = (psychologistId: string, date: string, hour: string) => `${psychologistId}|${date}T${hour}`;

/** Horas de trabajo de un psicólogo en una fecha según su horario semanal. */
export function hoursFor(p: Psicologo, date: string) {
  return p.horario[weekday(date)] ?? [];
}

/** ¿El horario ya pasó o está demasiado cerca para reservarlo? */
export function isTooSoon(date: string, hour: string, now = new Date()) {
  return toDate(date, hour).getTime() < now.getTime() + site.minHoursAhead * 3600 * 1000;
}

export function isTooFar(date: string, now = new Date()) {
  return date > addDays(todayEC(now), site.maxDaysAhead);
}

export function psicologosPara(psychologistId: string, modalidad?: Modalidad) {
  return equipo.filter(
    (p) => (psychologistId === 'any' || p.id === psychologistId) && (!modalidad || p.modalidades.includes(modalidad)),
  );
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

export function formatLong(date: string) {
  const [y, m, d] = date.split('-').map(Number);
  return cap(`${DIAS[weekday(date)]} ${d} de ${MESES[m - 1]} de ${y}`);
}

export function monthLabel(month: string) {
  const [y, m] = month.split('-').map(Number);
  return cap(`${MESES[m - 1]} ${y}`);
}

export function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return d.toISOString().slice(0, 7);
}
