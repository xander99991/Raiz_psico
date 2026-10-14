import type { Metadata } from 'next';
import { CheckIn, Respiracion, TestCorriente, Mitos, FraseDelDia } from '@/components/Rincon';
import { Reveal, SectionTitle } from '@/components/ui';

export const metadata: Metadata = { title: 'Rincón Raíz', description: 'Respiración guiada, test de corrientes, mitos y verdades sobre la terapia.' };

export default function RinconPage() {
  return (
    <>
      <section className="pb-12 pt-32">
        <div className="container-raiz grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <span className="eyebrow">Rincón Raíz</span>
            <h1 className="h-display mt-5 text-4xl leading-tight sm:text-6xl">Un rincón para hacer una pausa</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-tinta/75">Respira, juega y descubre. Nada de lo que hay aquí es un diagnóstico: son pequeñas puertas para escucharte.</p>
          </Reveal>
          <img src="/img/char-plantando.svg" alt="" className="mx-auto w-64 animate-float" />
        </div>
      </section>

      <section className="py-16">
        <div className="container-raiz">
          <SectionTitle eyebrow="Check-in" title="¿Cómo llegas hoy?" intro="Elige lo que más se parece a lo que sientes." />
          <div className="mt-10"><CheckIn /></div>
        </div>
      </section>

      <section id="respira" className="scroll-mt-24 bg-celeste-100/60 py-20">
        <div className="container-raiz">
          <SectionTitle eyebrow="Respira" title="Un minuto para volver al cuerpo" />
          <div className="mt-10"><Respiracion /></div>
        </div>
      </section>

      <section id="test" className="scroll-mt-24 py-20">
        <div className="container-raiz">
          <SectionTitle eyebrow="Test ligero" title="¿Qué corriente va contigo?" intro="5 preguntas rápidas para descubrir qué forma de acompañamiento podría resonarte." />
          <div className="mt-10"><TestCorriente /></div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-raiz">
          <SectionTitle eyebrow="Mitos y realidades" title="Lo que se dice de ir al psicólogo" intro="Toca cada tarjeta para darle la vuelta." />
          <div className="mt-10"><Mitos /></div>
        </div>
      </section>

      <section className="pb-24 pt-8">
        <div className="container-raiz"><FraseDelDia /></div>
      </section>
    </>
  );
}
