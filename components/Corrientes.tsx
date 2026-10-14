'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { corrientes } from '@/lib/corrientes';
import { equipo } from '@/lib/equipo';

export function Corrientes() {
  const ordenadas = [...corrientes].sort((a, b) => a.anio - b.anio);
  const [activa, setActiva] = useState(ordenadas[0].slug);

  useEffect(() => {
    const fromHash = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      if (corrientes.some((c) => c.slug === h)) {
        setActiva(h);
        document.getElementById('corrientes')?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const c = corrientes.find((x) => x.slug === activa)!;
  const quienes = equipo.filter((p) => p.corriente === c.slug);

  return (
    <div>
      {/* línea de tiempo */}
      <div className="relative -mx-4 overflow-x-auto px-4 pb-4 [scrollbar-width:thin]">
        <div className="relative flex min-w-max gap-3 pt-2">
          <div className="absolute left-0 right-0 top-[38px] h-1 rounded-full bg-gradient-to-r from-agua via-celeste to-marino" aria-hidden />
          {ordenadas.map((x) => (
            <button key={x.slug} onClick={() => setActiva(x.slug)} className="group relative flex w-36 flex-col items-center text-center" aria-pressed={activa === x.slug}>
              <span className="font-display text-xs font-bold text-tinta/50">{x.anio}</span>
              <span className={`relative z-10 mt-2 h-6 w-6 rounded-full border-4 border-hueso transition ${activa === x.slug ? 'scale-125 bg-turquesa' : 'bg-marino/30 group-hover:bg-celeste'}`} />
              <span className={`mt-3 font-display text-sm font-bold leading-tight transition ${activa === x.slug ? 'text-marino-900' : 'text-tinta/55'}`}>{x.nombre}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.article key={c.slug} id={c.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }} className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className={`rounded-[2rem] ${c.color} p-8 sm:p-10`}>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-marino-900/60">{c.epoca}</p>
            <h3 className="mt-2 font-display text-3xl font-bold text-marino-900 sm:text-4xl">{c.nombre}</h3>
            <p className="mt-2 text-sm text-marino-900/70">{c.referentes}</p>
            <p className="mt-6 font-display text-2xl font-bold text-marino">“{c.pregunta}”</p>
            <p className="mt-5 text-lg leading-relaxed text-marino-900/85">{c.idea}</p>
          </div>
          <div className="grid gap-4">
            <div className="card p-6">
              <p className="font-display font-bold text-turquesa-600">¿Cómo es una sesión?</p>
              <p className="mt-2 leading-relaxed text-tinta/75">{c.sesion}</p>
            </div>
            <div className="card p-6">
              <p className="font-display font-bold text-turquesa-600">Suele ayudar en</p>
              <p className="mt-2 leading-relaxed text-tinta/75">{c.ayuda}</p>
            </div>
            <div className="card p-6">
              <p className="font-display font-bold text-turquesa-600">En RAÍZ</p>
              {quienes.length ? (
                <p className="mt-2 text-tinta/75">
                  Trabaja desde aquí:{' '}
                  {quienes.map((p, i) => (
                    <span key={p.id}>{i > 0 && ', '}<Link href={`/equipo#${p.id}`} className="font-bold text-marino underline underline-offset-4">{p.nombre}</Link></span>
                  ))}
                </p>
              ) : (
                <p className="mt-2 text-tinta/75">Varios de nuestros profesionales integran herramientas de esta corriente.</p>
              )}
            </div>
          </div>
        </motion.article>
      </AnimatePresence>
    </div>
  );
}
