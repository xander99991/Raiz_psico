import type { Metadata } from 'next';
import { Calculadora } from '@/components/Calculadora';
import { Reveal } from '@/components/ui';
import { HeartHandshake, ShieldCheck, Users } from 'lucide-react';
import { tarifas } from '@/lib/tarifa';

export const metadata: Metadata = { title: '¿Cuánto cuesta mi cita?', description: 'Descubre en un minuto si te corresponde la tarifa social o la estándar.' };

export default function TarifaPage() {
  return (
    <div className="pb-24 pt-32">
      <div className="container-raiz grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <Reveal>
            <span className="eyebrow">Tarifa justa</span>
            <h1 className="h-display mt-5 text-4xl leading-tight sm:text-5xl">¿Cuánto cuesta mi cita?</h1>
            <p className="mt-5 text-lg leading-relaxed text-tinta/75">
              Tenemos dos tarifas: <strong className="text-marino-900">${tarifas.social.precio}</strong> (social) y{' '}
              <strong className="text-marino-900">${tarifas.estandar.precio}</strong> (estándar) por sesión. Responde 4 preguntas rápidas y te diremos cuál es la tuya.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="mt-10 space-y-5">
            {[
              { icon: ShieldCheck, t: 'Sin documentos', d: 'No pedimos papeles. Tu respuesta es suficiente.' },
              { icon: HeartHandshake, t: 'Justicia social', d: 'Quien puede aportar más sostiene el espacio de quien lo necesita.' },
              { icon: Users, t: 'Mismo cuidado', d: 'La tarifa no cambia la calidad ni el tiempo de tu sesión.' },
            ].map(({ icon: I, t, d }) => (
              <div key={t} className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-agua-100 text-turquesa-600"><I className="h-6 w-6" /></span>
                <div><p className="font-display font-bold text-marino-900">{t}</p><p className="text-tinta/70">{d}</p></div>
              </div>
            ))}
          </Reveal>
        </div>
        <Reveal delay={0.1}><Calculadora /></Reveal>
      </div>
    </div>
  );
}
