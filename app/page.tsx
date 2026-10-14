import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CalendarHeart, Calculator, Sparkles } from 'lucide-react';
import { Reveal, SectionTitle, Hilo, Avatar } from '@/components/ui';
import { HeroLine } from '@/components/HeroLine';
import { Faq } from '@/components/Faq';
import { Manifiesto } from '@/components/Manifiesto';
import { faqs, frases, pasos, servicios, site } from '@/lib/site';
import { equipo } from '@/lib/equipo';
import { getCorriente } from '@/lib/corrientes';
import { tarifas } from '@/lib/tarifa';

export default function Home() {
  return (
    <>
      {/* ───────── HERO ───────── */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-marino-900 pb-20 pt-32 sm:items-center sm:pb-28">
        <Image src="/img/hero.webp" alt="Sesión de psicología en un espacio cálido con plantas" fill priority className="-z-20 object-cover object-[60%_center]" sizes="100vw" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-marino-900/95 via-marino-900/70 to-marino-900/10" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-marino-900/80 to-transparent" />

        <div className="container-raiz">
          <div className="max-w-2xl">
            <Reveal>
              <span className="eyebrow !bg-white/15 !text-hueso backdrop-blur">Psicología clínica · {site.cities}</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-6 font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight text-hueso sm:text-6xl md:text-7xl">
                No todo tiene que estar <span className="text-agua">claro</span> para empezar.
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-hueso/85 sm:text-xl">
                Un espacio para escucharte, entender lo que pesa y reconectar contigo. Sin juicios, a tu ritmo y con una tarifa que se ajusta a tu realidad.
              </p>
            </Reveal>
            <Reveal delay={0.3} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/agenda" className="btn-turquesa !py-4 text-base">
                <CalendarHeart className="h-5 w-5" /> Agendar mi turno
              </Link>
              <Link href="/tarifa" className="btn !border-2 !border-white/40 !py-4 text-base text-hueso hover:!bg-white/10">
                <Calculator className="h-5 w-5" /> ¿Cuánto cuesta mi cita?
              </Link>
            </Reveal>
          </div>
        </div>
        <HeroLine />
      </section>

      {/* ───────── FRASES ───────── */}
      <div className="relative overflow-hidden border-y border-marino/10 bg-agua py-4" aria-label="Frases RAÍZ">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-lg font-bold text-marino-900">
          {[...frases, ...frases].map((f, i) => (
            <span key={i} className="flex items-center gap-10">
              {f} <img src="/img/isotipo.svg" alt="" className="h-6 w-6" />
            </span>
          ))}
        </div>
      </div>

      {/* ───────── MANIFIESTO ───────── */}
      <Manifiesto />

      {/* ───────── SERVICIOS ───────── */}
      <section className="py-24">
        <div className="container-raiz">
          <SectionTitle eyebrow="Cómo te acompañamos" title="Cuidar la mente también es cuidar la vida" intro="Atendemos de forma presencial en Quito y Ambato, y en línea desde cualquier lugar." />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {servicios.map((s, i) => (
              <Reveal key={s.titulo} delay={i * 0.08}>
                <article className="card group h-full p-7 transition duration-500 hover:-translate-y-1.5">
                  <Image src={s.icon} alt="" width={96} height={96} className="h-20 w-20 rounded-full transition duration-500 group-hover:rotate-6 group-hover:scale-105" />
                  <h3 className="mt-6 font-display text-xl font-bold leading-snug text-marino-900">{s.titulo}</h3>
                  <p className="mt-3 leading-relaxed text-tinta/75">{s.texto}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── TARIFA ───────── */}
      <section className="relative overflow-hidden bg-marino py-24 text-hueso">
        <div className="pattern-iso absolute inset-0" aria-hidden />
        <div className="container-raiz relative grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionTitle
              light
              eyebrow="Justicia social"
              title={<>Tu cita cuesta lo que es <span className="text-agua">justo para ti</span></>}
              intro="La salud mental no debería depender de cuánto ganas. Responde 4 preguntas y descubre si te corresponde la tarifa social o la estándar. Sin papeles: confiamos en tu palabra."
            />
            <Reveal delay={0.2} className="mt-9">
              <Link href="/tarifa" className="btn-light !py-4 text-base">
                Calcular mi tarifa <ArrowRight className="h-5 w-5" />
              </Link>
            </Reveal>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {[tarifas.social, tarifas.estandar].map((t, i) => (
              <Reveal key={t.id} delay={0.1 + i * 0.12}>
                <div className={`rounded-[2rem] p-8 ${i === 0 ? 'bg-agua text-marino-900 sm:-rotate-2' : 'bg-hueso text-marino-900 sm:translate-y-8 sm:rotate-2'}`}>
                  <p className="font-display text-sm font-bold uppercase tracking-widest opacity-70">{t.nombre}</p>
                  <p className="mt-4 font-display text-6xl font-bold">${t.precio}</p>
                  <p className="mt-2 text-sm opacity-75">por sesión de {site.sessionMinutes} minutos</p>
                  <p className="mt-6 text-sm leading-relaxed">
                    {i === 0 ? 'Para estudiantes, personas sin empleo o con ingresos ajustados.' : 'Para quienes pueden aportar más y así sostener la tarifa social.'}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── EQUIPO ───────── */}
      <section className="py-24">
        <div className="container-raiz">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionTitle eyebrow="Equipo" title="Personas que acompañan, cada una desde su mirada" />
            <Reveal><Link href="/equipo" className="btn-ghost">Conocer al equipo <ArrowRight className="h-4 w-4" /></Link></Reveal>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {equipo.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <Link href={`/equipo#${p.id}`} className="card group flex h-full flex-col p-6 transition hover:-translate-y-1">
                  <Avatar nombre={p.nombre} color={p.color} />
                  <h3 className="mt-5 font-display text-lg font-bold text-marino-900">{p.nombre}</h3>
                  <p className="text-sm text-tinta/60">{p.titulo}</p>
                  <span className="mt-4 inline-flex w-fit rounded-full bg-turquesa-100 px-3 py-1 text-xs font-bold text-turquesa-600">
                    {getCorriente(p.corriente)?.nombre}
                  </span>
                  <p className="mt-4 font-display text-sm italic text-marino">“{p.frase}”</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Hilo className="container-raiz" />

      {/* ───────── PSICOLOGÍA Y SOCIEDAD ───────── */}
      <section className="py-24">
        <div className="container-raiz grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div className="relative mx-auto aspect-square w-full max-w-md">
              {['bg-agua/40', 'bg-celeste/40', 'bg-turquesa/30', 'bg-agua/70', 'bg-marino'].map((c, i) => (
                <div
                  key={i}
                  className={`absolute rounded-full ${c} animate-float`}
                  style={{ inset: `${i * 10}%`, animationDelay: `${i * 0.4}s` }}
                />
              ))}
              <span className="absolute inset-0 grid place-items-center font-display text-2xl font-bold text-hueso">Tú</span>
            </div>
          </Reveal>
          <div>
            <SectionTitle
              eyebrow="Psicología y sociedad"
              title="No estás aislado: tu contexto también habla"
              intro="Lo que sientes tiene que ver con tu historia, pero también con tu familia, tu barrio, tu trabajo y la sociedad en la que vives. Te contamos cómo lo entiende la psicología, sus grandes corrientes y por qué eso importa en tu proceso."
            />
            <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-3">
              <Link href="/psicologia" className="btn-primary">Explorar la psicología <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/psicologia#corrientes" className="btn-ghost">Ver las corrientes</Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────── RINCÓN ───────── */}
      <section className="py-8">
        <div className="container-raiz">
          <Reveal>
            <Link href="/rincon" className="group relative block overflow-hidden rounded-[2.5rem] bg-turquesa p-8 text-white sm:p-12">
              <div className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
                <div>
                  <span className="eyebrow !bg-white/20 !text-white"><Sparkles className="h-3.5 w-3.5" /> Rincón Raíz</span>
                  <h2 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl">Respira un minuto, juega y descubre qué corriente va contigo</h2>
                  <p className="mt-4 max-w-lg text-white/85">Respiración guiada, un test ligero de corrientes, mitos y verdades, y una pregunta para ti: ¿cómo llegas hoy?</p>
                  <span className="btn-light mt-7 !text-turquesa-600">Entrar al rincón <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                </div>
                <img src="/img/char-grupo.svg" alt="Personajes de RAÍZ leyendo y oliendo flores" className="mx-auto w-full max-w-sm transition duration-700 group-hover:scale-105" />
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ───────── PASOS ───────── */}
      <section className="py-24">
        <div className="container-raiz">
          <SectionTitle center eyebrow="Así de simple" title="De la duda al primer encuentro" />
          <ol className="mt-14 grid gap-5 md:grid-cols-4">
            {pasos.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.1}>
                <li className="relative h-full rounded-[2rem] border-2 border-dashed border-marino/15 p-7">
                  <span className="font-display text-5xl font-bold text-celeste">{p.n}</span>
                  <h3 className="mt-4 font-display text-xl font-bold text-marino-900">{p.titulo}</h3>
                  <p className="mt-2 text-tinta/75">{p.texto}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="pb-24">
        <div className="container-raiz grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionTitle eyebrow="Preguntas frecuentes" title="Lo que muchas personas se preguntan antes de empezar" intro="Si te queda alguna duda, escríbenos por WhatsApp. Respondemos con calma." />
          <Faq items={faqs} />
        </div>
      </section>

      {/* ───────── CTA FINAL ───────── */}
      <section className="pb-24">
        <div className="container-raiz">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-agua-100 px-6 py-14 text-center sm:px-12">
              <img src="/img/char-plantando.svg" alt="Dos personajes plantando una flor juntos" className="mx-auto w-56 sm:w-72" />
              <p className="mt-8 font-display text-sm font-bold uppercase tracking-[0.3em] text-marino">Estás en</p>
              <h2 className="font-display text-5xl font-bold text-turquesa sm:text-7xl">PROCESO</h2>
              <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-marino">y está bien</p>
              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/agenda" className="btn-primary !py-4 text-base"><CalendarHeart className="h-5 w-5" /> Agendar mi turno</Link>
                <Link href="/tarifa" className="btn-ghost !py-4 text-base">Calcular mi tarifa</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
