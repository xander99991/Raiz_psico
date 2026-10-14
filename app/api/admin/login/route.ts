import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, adminToken, checkPassword } from '@/lib/admin';

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: '' }));
  if (!process.env.ADMIN_PASSWORD)
    return NextResponse.json({ error: 'Falta configurar ADMIN_PASSWORD en el servidor' }, { status: 500 });
  if (!checkPassword(String(password ?? ''))) return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, adminToken()!, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 12 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
