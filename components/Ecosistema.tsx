'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { capas } from '@/lib/corrientes';

const tonos = ['#2E7092', '#1AB099', '#78CDD0', '#99D0A9', '#DDF3F3'];
const texto = ['#FCFFF5', '#FFFFFF', '#1C4A63', '#1C4A63', '#1C4A63'];

/** Modelo ecológico (Bronfenbrenner): círculos concéntricos interactivos */
export function Ecosistema() {
  const [activa, setActiva] = useState(0);
  const capa = capas[activa];
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <div className="relative mx-auto aspect-square w-full max-w-[460px]">
        {[...capas].reverse().map((c, ri) => {
          const i = capas.length - 1 - ri;
          const inset = (capas.length - 1 - i) * 10;
          return (
            <button
              key={c.id}
              onClick={() => setActiva(i)}
              onMouseEnter={() => setActiva(i)}
              aria-label={c.nombre}
              aria-pressed={activa === i}
              className="absolute rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-marino/40"
              style={{
                inset: `${inset}%`,
                background: tonos[i],
                boxShadow: activa === i ? '0 0 0 6px rgba(252,255,245,.9), 0 20px 50px -20px rgba(28,74,99,.6)' : 'none',
                transform: activa === i ? 'scale(1.015)' : 'scale(1)',
              }}
            >
              <span
                className="absolute left-1/2 top-[3%] -translate-x-1/2 whitespace-nowrap font-display text-[11px] font-bold sm:text-sm"
                style={{ color: texto[i], top: i === 0 ? '44%' : '2.2%' }}
              >
                {c.nombre}
              </span>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={capa.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="card p-8">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-turquesa-600">Nivel {activa + 1} de {capas.length}</p>
          <h3 className="mt-2 font-display text-3xl font-bold text-marino-900">{capa.nombre}</h3>
          <p className="mt-4 text-lg leading-relaxed text-tinta/80">{capa.texto}</p>
          <p className="mt-6 rounded-2xl bg-agua-100 p-4 text-marino-900"><strong>Ejemplo:</strong> {capa.ejemplo}</p>
          <div className="mt-6 flex gap-2">
            {capas.map((c, i) => (
              <button key={c.id} onClick={() => setActiva(i)} className={`h-2.5 rounded-full transition-all ${i === activa ? 'w-8 bg-turquesa' : 'w-2.5 bg-marino/20'}`} aria-label={`Ver ${c.nombre}`} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
