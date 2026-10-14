import { NextRequest, NextResponse } from 'next/server';
import { disponibilidadMes } from '@/lib/disponibilidad';
import { modalidades, type Modalidad } from '@/lib/equipo';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const month = req.nextUrl.searchParams.get('month') ?? '';
  const psychologist = req.nextUrl.searchParams.get('psychologist') ?? 'any';
  const modality = req.nextUrl.searchParams.get('modality') as Modalidad | null;
  if (!/^\d{4}-\d{2}$/.test(month)) return NextResponse.json({ error: 'Mes inválido' }, { status: 400 });
  if (modality && !(modality in modalidades)) return NextResponse.json({ error: 'Modalidad inválida' }, { status: 400 });
  try {
    const days = await disponibilidadMes(month, psychologist, modality ?? undefined);
    return NextResponse.json({ month, days });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'No pudimos consultar la agenda. Intenta de nuevo.' }, { status: 500 });
  }
}
