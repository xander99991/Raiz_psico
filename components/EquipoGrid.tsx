'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarHeart, MapPin, Info } from 'lucide-react';
import { equipo, modalidades } from '@/lib/equipo';
import { corrientes, getCorriente } from '@/lib/corrientes';
import { Avatar } from './ui';

const DIAS = ['', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function EquipoGrid() {
  const usadas = corrientes.filter((c) => equipo.some((p) => p.corriente === c.slug));
  const [filtro, setFiltro] = useState('todas');
  const lista = equipo.filter((p) => filtro === 'todas' || p.corriente === filtro);

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filtrar por corriente">
        {[{ slug: 'todas', nombre: 'Todas las corrientes' }, ...usadas].map((c) => (
          <button
            key={c.slug}
            onClick={() => setFiltro(c.slug)}
            className={`rounded-full px-4 py-2 font-display text-sm font-bold transition ${
              filtro === c.slug ? 'bg-marino text-hueso' : 'bg-white/70 text-marino-900 hover:bg-agua-100'
            }`}
            aria-pressed={filtro === c.slug}
          >
            {c.nombre}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {lista.map((p) => {
            const c = getCorriente(p.corriente);
            const dias = Object.keys(p.horario).map(Number).sort();
            return (
              <motion.article
                layout
                key={p.id}
                id={p.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="card relative flex scroll-mt-28 flex-col p-7 sm:p-8"
              >
                {p.ejemplo && (
                  <span className="absolute right-5 top-5 rounded-full bg-hueso-200 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-tinta/50">
                    Perfil de ejemplo
                  </span>
                )}
                <div className="flex items-center gap-5">
                  <Avatar nombre={p.nombre} color={p.color} size="lg" />
                  <div>
                    <h2 className="font-display text-2xl font-bold text-marino-900">{p.nombre}</h2>
                    <p className="text-tinta/60">{p.titulo}</p>
                  </div>
                </div>
                <div className={`mt-6 rounded-3xl ${c?.color ?? 'bg-agua'} p-5`}>
                  <p className="text-xs font-bold uppercase tracking-widest text-marino-900/60">Corriente</p>
                  <p className="font-display text-lg font-bold text-marino-900">{c?.nombre}</p>
                  <p className="mt-1 text-sm text-marino-900/80">{c?.pregunta}</p>
                  <Link href={`/psicologia#${p.corriente}`} className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-marino underline-offset-4 hover:underline">
                    <Info className="h-3.5 w-3.5" /> ¿Qué es esta corriente?
                  </Link>
                </div>
                <p className="mt-5 font-display italic text-marino">“{p.frase}”</p>
                <p className="mt-3 leading-relaxed text-tinta/75">{p.bio}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.temas.map((t) => (
                    <span key={t} className="rounded-full bg-turquesa-100 px-3 py-1 text-sm font-semibold text-turquesa-600">{t}</span>
                  ))}
                </div>
                <div className="mt-6 grid gap-2 text-sm text-tinta/70">
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-turquesa" /> {p.modalidades.map((m) => modalidades[m]).join(' · ')}</p>
                  <p className="flex items-center gap-2"><CalendarHeart className="h-4 w-4 text-turquesa" /> Atiende: {dias.map((d) => DIAS[d]).join(', ')}</p>
                </div>
                <Link href={`/agenda?psicologo=${p.id}`} className="btn-primary mt-7 self-start">
                  Agendar con {p.nombre.split(' ')[0]}
                </Link>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
}
