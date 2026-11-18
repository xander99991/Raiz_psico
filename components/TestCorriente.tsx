'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, CalendarHeart, RotateCcw } from 'lucide-react';
import { equipo } from '@/lib/equipo';
import { getCorriente } from '@/lib/corrientes';
import { resultadoTest, test } from '@/lib/test-corrientes';
import { Avatar } from './ui';

// Solo corrientes principales que alguien del equipo ofrece
const disponibles = [...new Set(equipo.map((p) => p.corriente))];

function Profesionales({ slug }: { slug: string }) {
  const quienes = equipo.filter((p) => p.corriente === slug);
  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {quienes.map((p) => (
        <Link key={p.id} href={`/agenda?psicologo=${p.id}`} className="flex items-center gap-3 rounded-2xl border-2 border-marino/10 bg-white py-2 pl-2 pr-4 transition hover:border-turquesa">
          <Avatar nombre={p.nombre} color={p.color} foto={p.foto} />
          <span className="text-left">
            <span className="block font-display font-bold text-marino-900">{p.nombre}</span>
            <span className="text-sm text-turquesa-600">Agendar →</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

export function TestCorriente() {
  const [i, setI] = useState(0);
  const [resp, setResp] = useState<number[]>([]);
  const fin = i >= test.length;
  const res = fin ? resultadoTest(resp, disponibles) : [];
  const [primera, segunda] = res;
  const c1 = primera && getCorriente(primera.slug);
  const c2 = segunda && getCorriente(segunda.slug);

  function elegir(k: number) {
    const r = [...resp.slice(0, i), k];
    setResp(r);
    setTimeout(() => setI(i + 1), 180);
  }

  return (
    <div className="card overflow-hidden p-6 sm:p-10">
      {!fin && (
        <div className="flex items-center gap-3">
          {i > 0 && (
            <button onClick={() => setI(i - 1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-agua-100" aria-label="Pregunta anterior">
              <ArrowLeft className="h-4 w-4 text-marino" />
            </button>
          )}
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-marino/10">
            <motion.div className="h-full rounded-full bg-turquesa" animate={{ width: `${(i / test.length) * 100}%` }} />
          </div>
          <span className="font-display text-sm font-bold text-marino">{i + 1}/{test.length}</span>
        </div>
      )}
      <AnimatePresence mode="wait">
        {!fin ? (
          <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }} className="mt-7">
            <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-turquesa-600">{test[i].dim}</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-marino-900 sm:text-3xl">{test[i].q}</h3>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {test[i].o.map((o, k) => (
                <button key={o.t} onClick={() => elegir(k)}
                  className={`rounded-2xl border-2 px-5 py-4 text-left font-semibold transition hover:-translate-y-0.5 hover:border-turquesa ${resp[i] === k ? 'border-turquesa bg-turquesa-100' : 'border-marino/10 bg-white'}`}>
                  {o.t}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          c1 && (
            <motion.div key="fin" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
              <p className="text-center font-display text-sm font-bold uppercase tracking-widest text-turquesa-600">Tu enfoque es</p>
              <h3 className="mt-2 text-center font-display text-3xl font-bold text-marino-900 sm:text-5xl">{c1.nombre}</h3>
              <p className="mx-auto mt-3 max-w-xl text-center font-display text-xl text-marino">“{c1.pregunta}”</p>
              <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-relaxed text-tinta/75">{c1.idea}</p>

              <div className="mx-auto mt-8 max-w-xl space-y-3">
                {res.map((r) => (
                  <div key={r.slug}>
                    <div className="flex justify-between text-sm font-semibold text-marino-900"><span>{getCorriente(r.slug)?.nombre}</span><span>{r.pct}%</span></div>
                    <div className="mt-1 h-3 overflow-hidden rounded-full bg-marino/10">
                      <motion.div className={`h-full rounded-full ${r.slug === primera.slug ? 'bg-turquesa' : r.slug === segunda?.slug ? 'bg-celeste' : 'bg-marino/25'}`} initial={{ width: 0 }} animate={{ width: `${r.pct}%` }} transition={{ duration: 0.8 }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid gap-5 md:grid-cols-2">
                <div className="rounded-3xl bg-turquesa-100 p-6">
                  <p className="font-display text-xs font-bold uppercase tracking-widest text-turquesa-600">Te representa</p>
                  <p className="mt-1 font-display text-xl font-bold text-marino-900">{c1.nombre}</p>
                  <Profesionales slug={c1.slug} />
                </div>
                {c2 && (
                  <div className="rounded-3xl bg-celeste-100 p-6">
                    <p className="font-display text-xs font-bold uppercase tracking-widest text-marino">También puedes optar por</p>
                    <p className="mt-1 font-display text-xl font-bold text-marino-900">{c2.nombre}</p>
                    <p className="mt-1 text-sm text-tinta/70">{c2.pregunta}</p>
                    <Profesionales slug={c2.slug} />
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href={`/psicologia#${c1.slug}`} className="btn-ghost">Leer sobre {c1.nombre.toLowerCase()}</Link>
                <Link href="/agenda" className="btn-turquesa"><CalendarHeart className="h-4 w-4" /> Ver horarios</Link>
                <button onClick={() => { setI(0); setResp([]); }} className="btn-ghost"><RotateCcw className="h-4 w-4" /> Repetir</button>
              </div>
              <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-tinta/50">
                Es una orientación, no un diagnóstico. Se basa en las dimensiones de preferencia del Inventario Cooper-Norcross (C-NIP): la investigación muestra que tener en cuenta tus preferencias ayuda a que la terapia funcione mejor. En la primera sesión lo conversamos.
              </p>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
