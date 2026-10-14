import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { q, isUniqueViolation } from '@/lib/db';
import { horarioBloqueado } from '@/lib/disponibilidad';
import { hoursFor, isTooFar, isTooSoon, psicologosPara, slotKey, toDate } from '@/lib/agenda';
import { getPsicologo, modalidades, type Modalidad } from '@/lib/equipo';
import { calcularTarifa, type Respuestas } from '@/lib/tarifa';

export const dynamic = 'force-dynamic';

const clean = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  }

  const date = clean(body.date, 10);
  const hour = clean(body.hour, 5);
  const modality = clean(body.modality, 30) as Modalidad;
  const requested = clean(body.psychologistId, 60) || 'any';
  const name = clean(body.name, 120);
  const email = clean(body.email, 160).toLowerCase();
  const phone = clean(body.phone, 30);
  const reason = clean(body.reason, 1000);
  const answers = (typeof body.answers === 'object' && body.answers ? body.answers : {}) as Respuestas;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(hour))
    return NextResponse.json({ error: 'Fecha u hora inválida' }, { status: 400 });
  if (!(modality in modalidades)) return NextResponse.json({ error: 'Elige una modalidad' }, { status: 400 });
  if (name.length < 2) return NextResponse.json({ error: 'Escribe tu nombre' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Revisa tu correo' }, { status: 400 });
  if (!/^[+\d\s()-]{7,20}$/.test(phone)) return NextResponse.json({ error: 'Revisa tu número de teléfono' }, { status: 400 });
  if (isTooSoon(date, hour) || isTooFar(date))
    return NextResponse.json({ error: 'Ese horario ya no está disponible para reservar' }, { status: 400 });

  // El precio SIEMPRE se calcula en el servidor a partir de las respuestas
  const tarifa = calcularTarifa(answers);
  if (!tarifa) return NextResponse.json({ error: 'Primero calcula tu tarifa' }, { status: 400 });

  const candidatos = psicologosPara(requested, modality).filter((p) => hoursFor(p, date).includes(hour));
  if (candidatos.length === 0) return NextResponse.json({ error: 'No hay atención en ese horario' }, { status: 400 });

  try {
    for (const p of candidatos) {
      if (await horarioBloqueado(p.id, date, hour)) continue;
      const id = randomUUID();
      try {
        // slot_key es UNIQUE: si dos personas reservan a la vez, solo una lo consigue
        await q(
          `INSERT INTO appointments (id, psychologist_id, start, slot_key, modality, name, email, phone, reason, tier, price, answers)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
          [id, p.id, toDate(date, hour), slotKey(p.id, date, hour), modality, name, email, phone, reason || null, tarifa.tier, tarifa.precio, JSON.stringify(answers)],
        );
      } catch (e) {
        if (isUniqueViolation(e)) continue; // ocupado: probamos con el siguiente psicólogo
        throw e;
      }
      return NextResponse.json(
        { ok: true, id, psychologist: getPsicologo(p.id)?.nombre, psychologistId: p.id, price: tarifa.precio, tier: tarifa.tier },
        { status: 201 },
      );
    }
    return NextResponse.json({ error: 'Ese horario se acaba de ocupar. Elige otro, por favor.' }, { status: 409 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'No pudimos guardar tu turno. Intenta de nuevo.' }, { status: 500 });
  }
}
