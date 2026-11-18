'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, CalendarHeart, GraduationCap, Info, MapPin, Sparkles, Users } from 'lucide-react';
import { equipo, modalidades, type Psicologo } from '@/lib/equipo';
import { corrientes, getCorriente } from '@/lib/corrientes';
import { Avatar } from './ui';

const DIAS = ['', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function Modalidad({ p }: { p: Psicologo }) {
  if (p.modalidadesPorDia) {
    const porMod = new Map<string, number[]>();
    for (const [d, ms] of Object.entries(p.modalidadesPorDia)) for (const m of ms ?? []) porMod.set(m, [...(porMod.get(m) ?? []), Number(d)]);
    return (
      <>
        {[...porMod.entries()].map(([m, ds]) => (
          <span key={m} className="block">{modalidades[m as keyof typeof modalidades]} <span className="text-tinta/50">({ds.length >= 5 ? 'lun–vie' : ds.map((d) => DIAS[d].toLowerCase()).join(', ')})</span></span>
        ))}
      </>
    );
  }
  return <>{p.modalidades.map((m) => modalidades[m]).join(' · ')}</>;
}

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
            const horas = Object.values(p.horario).reduce((s, x) => s + x.length, 0);
            const extra = (p.complementarias ?? []).map((s) => getCorriente(s)?.nombre).filter(Boolean);
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
                {p.destacado && (
                  <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-turquesa-100 px-3 py-1 text-xs font-bold text-turquesa-600">
                    <Sparkles className="h-3 w-3" /> {p.destacado}
                  </span>
                )}
                <div className="flex items-center gap-5 pr-16 sm:pr-0">
                  <Avatar nombre={p.nombre} color={p.color} foto={p.foto} size="lg" />
                  <div>
                    <h2 className="font-display text-2xl font-bold text-marino-900">{p.nombre}</h2>
                    <p className="text-tinta/60">{p.titulo}</p>
                    {p.experiencia && p.experiencia >= 2 && !p.destacado?.includes('experiencia') && (
                      <p className="mt-1 text-sm font-semibold text-turquesa-600">{p.experiencia} años de experiencia</p>
                    )}
                  </div>
                </div>

                <p className="mt-6 font-display text-lg italic leading-snug text-marino">“{p.frase}”</p>
                <p className="mt-3 leading-relaxed text-tinta/80">{p.bio}</p>

                <div className={`mt-6 rounded-3xl ${c?.color ?? 'bg-agua'} p-5`}>
                  <p className="text-xs font-bold uppercase tracking-widest text-marino-900/60">Enfoque</p>
                  <p className="font-display text-lg font-bold text-marino-900">{c?.nombre}</p>
                  {extra.length > 0 && <p className="mt-1 text-sm text-marino-900/80">También integra: {extra.join(', ')}</p>}
                  <Link href={`/psicologia#${p.corriente}`} className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-marino underline-offset-4 hover:underline">
                    <Info className="h-3.5 w-3.5" /> ¿Qué es este enfoque?
                  </Link>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {p.temas.slice(0, 7).map((t) => (
                    <span key={t} className="rounded-full bg-turquesa-100 px-3 py-1 text-sm font-semibold text-turquesa-600">{t}</span>
                  ))}
                </div>

                <div className="mt-6 grid gap-2.5 text-sm text-tinta/75">
                  <p className="flex items-start gap-2"><Users className="mt-0.5 h-4 w-4 shrink-0 text-turquesa" /> Atiende a: {p.poblaciones.join(', ').toLowerCase()}</p>
                  <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-turquesa" /><div><Modalidad p={p} /></div></div>
                  <p className="flex items-start gap-2"><CalendarHeart className="mt-0.5 h-4 w-4 shrink-0 text-turquesa" /> {dias.map((d) => DIAS[d]).join(', ')} · {horas} horarios por semana</p>
                </div>

                <details className="group mt-5 rounded-2xl bg-hueso-200/70 px-4 py-3 text-sm text-tinta/75">
                  <summary className="flex cursor-pointer list-none items-center gap-2 font-display font-bold text-marino-900">
                    <GraduationCap className="h-4 w-4 text-turquesa" /> Formación
                    <span className="ml-auto text-xs text-tinta/50 group-open:hidden">ver</span>
                  </summary>
                  <ul className="mt-3 space-y-1.5">
                    {p.formacion.map((f) => <li key={f}>· {f}</li>)}
                  </ul>
                  {p.senescyt && <p className="mt-3 flex items-center gap-1.5 text-xs"><Award className="h-3.5 w-3.5 text-turquesa" /> Registro SENESCYT {p.senescyt}</p>}
                </details>

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
