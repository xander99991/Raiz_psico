'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarHeart, RotateCcw } from 'lucide-react';
import { calcularTarifa, preguntas, STORAGE_KEY, type Respuestas } from '@/lib/tarifa';
import { site } from '@/lib/site';

export type ResultadoTarifa = { answers: Respuestas; tier: string; precio: number; nombre: string };

export function guardarTarifa(r: ResultadoTarifa) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(r));
  } catch {}
}
export function leerTarifa(): ResultadoTarifa | null {
  try {
    const v = sessionStorage.getItem(STORAGE_KEY);
    if (!v) return null;
    const r = JSON.parse(v) as ResultadoTarifa;
    return calcularTarifa(r.answers) ? r : null;
  } catch {
    return null;
  }
}

export function Calculadora({ embedded = false, onDone }: { embedded?: boolean; onDone?: (r: ResultadoTarifa) => void }) {
  const [paso, setPaso] = useState(0);
  const [answers, setAnswers] = useState<Respuestas>({});
  const total = preguntas.length;
  const terminado = paso >= total;
  const resultado = terminado ? calcularTarifa(answers) : null;

  function elegir(preguntaId: string, opcionId: string) {
    const next = { ...answers, [preguntaId]: opcionId };
    setAnswers(next);
    setTimeout(() => {
      setPaso((p) => p + 1);
      if (paso + 1 >= total) {
        const r = calcularTarifa(next);
        if (r) {
          const res = { answers: next, tier: r.tier, precio: r.precio, nombre: r.nombre };
          guardarTarifa(res);
          onDone?.(res);
        }
      }
    }, 220);
  }

  const q = preguntas[paso];

  return (
    <div className={`card relative overflow-hidden ${embedded ? 'p-6 sm:p-8' : 'p-6 sm:p-10'}`}>
      {/* progreso */}
      <div className="flex items-center gap-3">
        {paso > 0 && !terminado && (
          <button onClick={() => setPaso((p) => p - 1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-agua-100" aria-label="Pregunta anterior">
            <ArrowLeft className="h-4 w-4 text-marino" />
          </button>
        )}
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-marino/10">
          <motion.div className="h-full rounded-full bg-turquesa" animate={{ width: `${(Math.min(paso, total) / total) * 100}%` }} transition={{ duration: 0.4 }} />
        </div>
        <span className="font-display text-sm font-bold text-marino">{Math.min(paso + 1, total)}/{total}</span>
      </div>

      <AnimatePresence mode="wait">
        {!terminado && q && (
          <motion.div key={q.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="mt-8">
            <h3 className="font-display text-2xl font-bold leading-snug text-marino-900 sm:text-3xl">{q.texto}</h3>
            {q.ayuda && <p className="mt-2 text-tinta/60">{q.ayuda}</p>}
            <div className={`mt-7 grid gap-3 ${q.opciones.length > 4 ? 'sm:grid-cols-2' : ''}`}>
              {q.opciones.map((o) => {
                const sel = answers[q.id] === o.id;
                return (
                  <button
                    key={o.id}
                    onClick={() => elegir(q.id, o.id)}
                    className={`flex items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left font-semibold transition duration-200 hover:-translate-y-0.5 ${
                      sel ? 'border-turquesa bg-turquesa-100 text-marino-900' : 'border-marino/10 bg-white hover:border-turquesa/50'
                    }`}
                  >
                    <span className="text-2xl" aria-hidden>{o.emoji}</span>
                    <span>{o.texto}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {terminado && resultado && (
          <motion.div key="res" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="mt-8 text-center">
            <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-turquesa-600">Tu tarifa es</p>
            <p className="mt-2 font-display text-2xl font-bold text-marino-900">{resultado.nombre}</p>
            <motion.p initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="font-display text-8xl font-bold text-marino">
              ${resultado.precio}
            </motion.p>
            <p className="text-tinta/70">por sesión de {site.sessionMinutes} minutos</p>
            <p className="mx-auto mt-6 max-w-md leading-relaxed text-tinta/75">
              {resultado.tier === 'social'
                ? 'Con la tarifa social, quienes pueden aportar más sostienen tu espacio. Eso también es comunidad.'
                : 'Con tu tarifa estándar ayudas a que otras personas puedan acceder a la tarifa social. Gracias por ser parte.'}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {!embedded && (
                <Link href="/agenda" className="btn-turquesa !py-4">
                  <CalendarHeart className="h-5 w-5" /> Agendar con esta tarifa
                </Link>
              )}
              <button onClick={() => { setPaso(0); setAnswers({}); }} className="btn-ghost">
                <RotateCcw className="h-4 w-4" /> Volver a responder
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
