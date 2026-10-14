import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Brain, HeartPulse, Users } from 'lucide-react';
import { Reveal, SectionTitle, Hilo } from '@/components/ui';
import { Ecosistema } from '@/components/Ecosistema';
import { Corrientes } from '@/components/Corrientes';

export const metadata: Metadata = {
  title: 'Psicología y sociedad',
  description: 'Qué es la psicología, cómo la sociedad influye en nuestra salud mental y cuáles son sus grandes corrientes.',
};

const determinantes = [
  'Pobreza y deudas',
  'Desempleo y trabajo precario',
  'Violencia en casa o en la calle',
  'Discriminación y racismo',
  'Migración y desarraigo',
  'Soledad y falta de redes',
  'Acceso a salud y educación',
  'Roles de género rígidos',
];

const valores = [
  { t: 'Empatía', d: 'Escuchar sin juzgar, desde tu historia y no desde una etiqueta.' },
  { t: 'Acompañamiento', d: 'Acompañar no es dirigir, es estar. El proceso es tuyo.' },
  { t: 'Construcción', d: 'Construimos juntos nuevas formas de entender y de estar.' },
  { t: 'Justicia social', d: 'Miramos el contexto y hacemos la terapia accesible con tarifas justas.' },
];

export default function PsicologiaPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pb-16 pt-32">
        <div className="container-raiz grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <span className="eyebrow">Psicología y sociedad</span>
            <h1 className="h-display mt-5 text-4xl leading-[1.1] sm:text-6xl">
              Las personas no actúan de forma <span className="text-turquesa">aislada</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-tinta/75">
              La psicología estudia cómo pensamos, sentimos y nos relacionamos. Pero nadie vive en el vacío: tu historia se entreteje con tu familia, tu comunidad y la sociedad. Entender ese tejido es parte de sanar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contexto" className="btn-primary">Empezar a explorar</a>
              <a href="#corrientes" className="btn-ghost">Ir a las corrientes</a>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative overflow-hidden rounded-[2.5rem]">
              <Image src="/img/hilos.webp" alt="Dos personas sostienen un hilo enredado que se va desenredando" width={900} height={600} className="aspect-[4/3] w-full object-cover" priority />
            </div>
          </Reveal>
        </div>
      </section>

      {/* BIOPSICOSOCIAL */}
      <section className="py-20">
        <div className="container-raiz">
          <SectionTitle
            eyebrow="Una mirada completa"
            title="Somos cuerpo, mente y contexto a la vez"
            intro="Desde finales de los años 70, el modelo biopsicosocial propone que la salud y el malestar nacen de la interacción de tres dimensiones. Ninguna explica todo por sí sola."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { icon: HeartPulse, t: 'Lo biológico', d: 'El cuerpo, el sueño, la alimentación, las hormonas, la herencia. El cuerpo siente lo que vivimos.', c: 'bg-celeste-100' },
              { icon: Brain, t: 'Lo psicológico', d: 'Pensamientos, emociones, recuerdos, la forma en que aprendimos a enfrentar las cosas.', c: 'bg-agua-100' },
              { icon: Users, t: 'Lo social', d: 'Vínculos, trabajo, dinero, cultura, violencia o apoyo. El lugar donde vivimos también nos forma.', c: 'bg-turquesa-100' },
            ].map(({ icon: I, t, d, c }, i) => (
              <Reveal key={t} delay={i * 0.1}>
                <div className={`h-full rounded-[2rem] ${c} p-8`}>
                  <I className="h-9 w-9 text-marino" />
                  <h3 className="mt-5 font-display text-2xl font-bold text-marino-900">{t}</h3>
                  <p className="mt-3 leading-relaxed text-tinta/75">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ECOLÓGICO */}
      <section id="contexto" className="scroll-mt-24 py-20">
        <div className="container-raiz">
          <SectionTitle
            eyebrow="Tu ecosistema"
            title="Los círculos que te rodean"
            intro="El psicólogo Urie Bronfenbrenner propuso mirar a cada persona dentro de círculos que se influyen entre sí. Toca cada círculo para descubrirlo."
          />
          <div className="mt-12"><Ecosistema /></div>
        </div>
      </section>

      {/* DETERMINANTES */}
      <section className="relative overflow-hidden bg-marino-900 py-24 text-hueso">
        <div className="pattern-iso absolute inset-0" aria-hidden />
        <div className="container-raiz relative grid gap-12 lg:grid-cols-2">
          <div>
            <SectionTitle
              light
              eyebrow="Cuando el malestar también es social"
              title="No es falta de voluntad"
              intro="La Organización Mundial de la Salud reconoce que las condiciones en que vivimos —ingresos, empleo, vivienda, violencia, discriminación— influyen directamente en la salud mental. Según la OMS, alrededor de 1 de cada 8 personas en el mundo vive con un trastorno mental."
            />
            <Reveal delay={0.2}>
              <blockquote className="mt-10 border-l-4 border-agua pl-6 font-display text-xl leading-relaxed text-hueso/90">
                Desde Latinoamérica, Ignacio Martín-Baró planteó una psicología que no solo mira dentro de la persona, sino también las injusticias que la rodean, para ayudar a transformarlas.
              </blockquote>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-celeste">Factores que pesan</p>
            <ul className="mt-5 flex flex-wrap gap-3">
              {determinantes.map((d) => (
                <li key={d} className="rounded-full border border-white/20 bg-white/5 px-5 py-3 font-display font-bold text-hueso transition hover:bg-agua hover:text-marino-900">{d}</li>
              ))}
            </ul>
            <p className="mt-8 leading-relaxed text-hueso/75">
              Por eso en terapia no solo preguntamos “¿qué te pasa?”, sino también “¿qué está pasando a tu alrededor?”. Nombrar el contexto alivia la culpa y abre caminos nuevos.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CORRIENTES */}
      <section id="corrientes" className="scroll-mt-24 py-24">
        <div className="container-raiz">
          <SectionTitle
            eyebrow="Las grandes corrientes"
            title="Muchos caminos para llegar a ti"
            intro="A lo largo de más de un siglo, la psicología ha desarrollado distintas formas de entender y acompañar. Recorre la línea de tiempo y toca cada corriente."
          />
          <div className="mt-12"><Corrientes /></div>
        </div>
      </section>

      <Hilo className="container-raiz" color="#99D0A9" />

      {/* RAÍZ */}
      <section className="py-24">
        <div className="container-raiz">
          <SectionTitle center eyebrow="¿Y en RAÍZ?" title="Una mirada humana, consciente y contextual" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {valores.map((v, i) => (
              <Reveal key={v.t} delay={i * 0.08}>
                <div className="card h-full p-7">
                  <span className="font-display text-4xl font-bold text-celeste">0{i + 1}</span>
                  <h3 className="mt-3 font-display text-xl font-bold text-marino-900">{v.t}</h3>
                  <p className="mt-2 text-tinta/75">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/equipo" className="btn-primary">Conocer al equipo <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/rincon#test" className="btn-ghost">¿Qué corriente va conmigo?</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
