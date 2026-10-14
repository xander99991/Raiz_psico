import type { Metadata } from 'next';
import { Agenda } from '@/components/Agenda';
import { Reveal } from '@/components/ui';

export const metadata: Metadata = { title: 'Agendar turno', description: 'Elige psicólogo, modalidad, día y hora. Solo verás los horarios libres.' };

export default function AgendaPage({ searchParams }: { searchParams: { psicologo?: string } }) {
  return (
    <div className="pb-24 pt-32">
      <div className="container-raiz">
        <Reveal className="mb-10 max-w-2xl">
          <span className="eyebrow">Agenda</span>
          <h1 className="h-display mt-5 text-4xl leading-tight sm:text-5xl">Reserva tu espacio</h1>
          <p className="mt-4 text-lg text-tinta/75">Cuatro pasos y listo. Solo verás los horarios libres: lo que ya está ocupado no se puede elegir.</p>
        </Reveal>
        <Agenda psicologoInicial={searchParams.psicologo} />
      </div>
    </div>
  );
}
