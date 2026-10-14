import type { Metadata } from 'next';
import Link from 'next/link';
import { EquipoGrid } from '@/components/EquipoGrid';
import { Reveal } from '@/components/ui';

export const metadata: Metadata = { title: 'Equipo', description: 'Conoce a las psicólogas y psicólogos de RAÍZ y la corriente desde la que trabajan.' };

export default function EquipoPage() {
  return (
    <div className="pb-24 pt-32">
      <div className="container-raiz">
        <Reveal className="grid items-end gap-8 md:grid-cols-[1.5fr_1fr]">
          <div>
            <span className="eyebrow">Equipo</span>
            <h1 className="h-display mt-5 text-4xl leading-tight sm:text-5xl">Cada persona acompaña desde una mirada distinta</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-tinta/75">
              Todas las corrientes buscan tu bienestar, pero lo hacen por caminos diferentes. Filtra por corriente, lee cómo trabaja cada quien y elige con quién te sientes en confianza.
              ¿No sabes cuál elegir? <Link href="/rincon#test" className="font-bold text-turquesa-600 underline underline-offset-4">Haz el test</Link> o agenda con quien tenga espacio.
            </p>
          </div>
          <img src="/img/char-grupo.svg" alt="" className="hidden w-full max-w-xs justify-self-end md:block" />
        </Reveal>
        <EquipoGrid />
      </div>
    </div>
  );
}
