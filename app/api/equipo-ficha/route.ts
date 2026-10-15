import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { q } from '@/lib/db';
import type { Ficha } from '@/lib/ficha';

export const dynamic = 'force-dynamic';
const MAX_FOTO = 900_000; // ~650 KB
const MAX_FICHAS = 200;

const txt = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const arr = (v: unknown, max = 30) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string').map((x) => x.slice(0, 80)).slice(0, max) : []);

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  }
  const f = (body.ficha ?? {}) as Partial<Ficha>;
  const foto = typeof body.foto === 'string' ? body.foto : '';

  const horario: Record<string, string[]> = {};
  if (f.horario && typeof f.horario === 'object')
    for (const [d, hs] of Object.entries(f.horario)) if (/^[1-6]$/.test(d)) horario[d] = arr(hs, 24).filter((h) => /^\d{2}:\d{2}$/.test(h));

  const ficha: Ficha = {
    nombre: txt(f.nombre, 120), nombreWeb: txt(f.nombreWeb, 80), titulo: txt(f.titulo, 100),
    senescyt: txt(f.senescyt, 40), mostrarSenescyt: !!f.mostrarSenescyt, formacion: txt(f.formacion, 600),
    experiencia: txt(f.experiencia, 20), corriente: txt(f.corriente, 60), corrienteOtra: txt(f.corrienteOtra, 100),
    complementarias: arr(f.complementarias), frase: txt(f.frase, 120), bio: txt(f.bio, 600),
    temas: arr(f.temas), temasOtros: txt(f.temasOtros, 300), poblaciones: arr(f.poblaciones), idiomas: txt(f.idiomas, 100),
    modalidades: arr(f.modalidades, 5), horario, email: txt(f.email, 160), whatsapp: txt(f.whatsapp, 30),
    redes: txt(f.redes, 300), comentarios: txt(f.comentarios, 1000), consentimiento: !!f.consentimiento,
  };

  if (ficha.nombre.length < 3) return NextResponse.json({ error: 'Escribe tu nombre completo' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ficha.email)) return NextResponse.json({ error: 'Revisa tu correo' }, { status: 400 });
  if (!ficha.corriente) return NextResponse.json({ error: 'Elige tu corriente principal' }, { status: 400 });
  if (!ficha.modalidades.length) return NextResponse.json({ error: 'Elige al menos una modalidad' }, { status: 400 });
  if (!Object.values(horario).some((h) => h.length)) return NextResponse.json({ error: 'Marca al menos un horario' }, { status: 400 });
  if (!ficha.consentimiento) return NextResponse.json({ error: 'Necesitamos tu autorización para publicar tu perfil' }, { status: 400 });
  if (foto && (!/^data:image\/(webp|jpeg|png);base64,/.test(foto) || foto.length > MAX_FOTO))
    return NextResponse.json({ error: 'La foto no es válida o es muy pesada' }, { status: 400 });

  try {
    const [{ n }] = await q<{ n: number }>(`SELECT count(*)::int AS n FROM team_profiles`);
    if (n >= MAX_FICHAS) return NextResponse.json({ error: 'Se alcanzó el límite de fichas. Avisa a la administración.' }, { status: 429 });
    await q(`INSERT INTO team_profiles (id, data, photo) VALUES ($1, $2, $3)`, [randomUUID(), JSON.stringify(ficha), foto || null]);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'No pudimos guardar tu ficha. Intenta de nuevo.' }, { status: 500 });
  }
}
