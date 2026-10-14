// Diagnóstico de la conexión a la base de datos (no muestra datos sensibles)
import { NextResponse } from 'next/server';
import { pool, ensureSchema, limpiarUrl } from '@/lib/db';

export const dynamic = 'force-dynamic';

function clasificar(e: unknown) {
  const err = e as { code?: string; message?: string };
  const msg = (err.message ?? '').toLowerCase();
  if (msg.includes('password authentication')) return 'La contraseña de DATABASE_URL es incorrecta (¿se copió con asteriscos?).';
  if (msg.includes('enotfound') || msg.includes('getaddrinfo')) return 'No se encuentra el servidor: la dirección de DATABASE_URL está mal escrita.';
  if (msg.includes('ssl') || msg.includes('certificate')) return 'Problema de SSL: revisa que DATABASE_URL termine en ?sslmode=require.';
  if (msg.includes('invalid url') || msg.includes('invalid connection')) return 'DATABASE_URL no tiene formato válido (¿tiene comillas o espacios?).';
  if (msg.includes('does not exist')) return 'La base de datos o el usuario no existen en Neon.';
  if (msg.includes('timeout') || msg.includes('econnrefused')) return 'Neon no respondió a tiempo. Intenta de nuevo en un minuto.';
  return `Error no reconocido (${err.code ?? 'sin código'}).`;
}

export async function GET() {
  const url = process.env.DATABASE_URL;
  if (!url) return NextResponse.json({ ok: false, problema: 'Falta la variable DATABASE_URL en Vercel.' }, { status: 500 });
  const limpia = limpiarUrl(url);
  const forma = {
    empiezaBien: /^postgres(ql)?:\/\//.test(url.trim()),
    seEncontroDireccion: /^postgres(ql)?:\/\//.test(limpia),
    inicio: url.trim().slice(0, 14).replace(/:[^@]*$/, ':…'),
    servidor: (limpia.match(/@([^/?]+)/) ?? [])[1] ?? 'no encontrado',
    tieneComillasOEspacios: /["'\s]/.test(url),
    tieneAsteriscos: url.includes('***'),
  };
  try {
    await ensureSchema();
    await pool.query('SELECT 1');
    return NextResponse.json({ ok: true, mensaje: 'Base de datos conectada y tablas listas.', panel: !!process.env.ADMIN_PASSWORD });
  } catch (e) {
    console.error('Salud BD:', e);
    return NextResponse.json({ ok: false, problema: clasificar(e), forma }, { status: 500 });
  }
}
