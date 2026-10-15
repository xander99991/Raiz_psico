import { NextRequest, NextResponse } from 'next/server';
import { q } from '@/lib/db';
import { isAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const fichas = await q(`SELECT id, data, photo, created_at AS "createdAt" FROM team_profiles ORDER BY created_at DESC`);
  return NextResponse.json({ fichas });
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 });
  await q(`DELETE FROM team_profiles WHERE id = $1`, [id]);
  return NextResponse.json({ ok: true });
}
