'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarHeart, Check, RotateCcw, ShieldCheck } from 'lucide-react';
import { calcularTarifa, DECLARACION, preguntasVisibles, STORAGE_KEY, type Respuestas } from '@/lib/tarifa';
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
    const c = calcularTarifa(r.answers);
    return c ? { ...r, tier: c.tier, precio: c.precio, nombre: c.nombre } : null;
  } catch {
    return null;
  }
}

export function Calculadora({ embedded = false, onDone }: { embedded?: boolean; onDone?: (r: ResultadoTarifa) => void }) {
  const [paso, setPaso] = useState(0);
  const [answers, setAnswers] = useState<Respuestas>({});
  const [acepto, setAcepto] = useState(false);
  const lista = useMemo(() => preguntasVisibles(answers), [answers]);
  const total = lista.length + 1; // + declaración
  const enDeclaracion = paso === lista.length;
  const terminado = paso > lista.length;
  const resultado = terminado ? calcularTarifa(answers) : null;
  const q = lista[paso];

  function elegir(preguntaId: string, opcionId: string) {
    const next = { ...answers, [preguntaId]: opcionId };
    if (preguntaId === 'ocupacion' && opcionId !== 'estudiante') delete next.institucion;
    setAnswers(next);
    setTimeout(() => setPaso((p) => p + 1), 200);
  }

  function confirmar() {
    const next = { ...answers, declaracion: 'si' };
    setAnswers(next);
    const r = calcularTarifa(next);
    if (r) {
      const res = { answers: next, tier: r.tier, precio: r.precio, nombre: r.nombre };
      guardarTarifa(res);
      onDone?.(res);
    }
    setPaso(lista.length + 1);
  }

  function reiniciar() {
    setPaso(0);
    setAnswers({});
    setAcepto(false);
  }

  return (
    <div className={`card relative overflow-hidden ${embedded ? 'p-6 sm:p-8' : 'p-6 sm:p-10'}`}>
      {!terminado && (
        <div className="flex items-center gap-3">
          {paso > 0 && (
            <button onClick={() => setPaso((p) => p - 1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-agua-100" aria-label="Pregunta anterior">
              <ArrowLeft className="h-4 w-4 text-marino" />
            </button>
          )}
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-marino/10">
            <motion.div className="h-full rounded-full bg-turquesa" animate={{ width: `${(paso / total) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>
          <span className="font-display text-sm font-bold text-marino">{paso + 1}/{total}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!terminado && !enDeclaracion && q && (
          <motion.div key={q.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="mt-7">
            <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-turquesa-600">{q.bloque}</p>
            <h3 className="mt-2 font-display text-2xl font-bold leading-snug text-marino-900 sm:text-[1.7rem]">{q.texto}</h3>
            {q.ayuda && <p className="mt-2 text-tinta/60">{q.ayuda}</p>}
            <div className={`mt-6 grid gap-3 ${q.compacta ? 'grid-cols-5' : q.opciones.length > 4 ? 'sm:grid-cols-2' : ''}`}>
              {q.opciones.map((o) => {
                const sel = answers[q.id] === o.id;
                return (
                  <button
                    key={o.id}
                    onClick={() => elegir(q.id, o.id)}
                    className={`flex items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left font-semibold transition duration-200 hover:-translate-y-0.5 ${
                      q.compacta ? 'justify-center px-2 text-center' : ''
                    } ${sel ? 'border-turquesa bg-turquesa-100 text-marino-900' : 'border-marino/10 bg-white hover:border-turquesa/50'}`}
                  >
                    {o.emoji && <span className="text-2xl" aria-hidden>{o.emoji}</span>}
                    <span>{o.texto}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {enDeclaracion && (
          <motion.div key="decl" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="mt-7">
            <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-turquesa-600">Último paso</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-marino-900 sm:text-[1.7rem]">Antes de ver tu tarifa</h3>
            <label className="mt-6 flex cursor-pointer items-start gap-4 rounded-2xl border-2 border-marino/10 bg-white p-5 transition hover:border-turquesa/50">
              <input type="checkbox" checked={acepto} onChange={(e) => setAcepto(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-turquesa" />
              <span className="leading-relaxed text-tinta/85">{DECLARACION}</span>
            </label>
            <button onClick={confirmar} disabled={!acepto} className="btn-turquesa mt-6 w-full !py-4 text-base">
              <ShieldCheck className="h-5 w-5" /> Ver mi tarifa
            </button>
          </motion.div>
        )}

        {terminado && resultado && (
          <motion.div key="res" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="text-center">
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
              {embedded && (
                <span className="btn bg-agua-100 text-marino-900"><Check className="h-4 w-4" /> Tarifa guardada para tu turno</span>
              )}
              <button onClick={reiniciar} className="btn-ghost">
                <RotateCcw className="h-4 w-4" /> Volver a responder
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
