'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const lineas = [
  'A veces, lo que sentimos no tiene forma,',
  'se enreda, se confunde, pesa.',
  'Y está bien.',
  'Porque entendernos no es inmediato,',
  'es un proceso.',
  'Acompañar no es dirigir, es estar.',
  'Es ayudarte a reconectar contigo.',
];

function Linea({ texto, i, total, progress }: { texto: string; i: number; total: number; progress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const start = 0.08 + (i / total) * 0.32;
  const opacity = useTransform(progress, [start, start + 0.08], [0.15, 1]);
  const x = useTransform(progress, [start, start + 0.08], [12, 0]);
  return (
    <motion.p style={{ opacity, x }} className="font-display text-2xl font-bold leading-snug text-hueso sm:text-4xl">
      {texto}
    </motion.p>
  );
}

export function Manifiesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  return (
    <section ref={ref} className="relative overflow-hidden bg-[#2C7A6B] py-24 sm:py-32">
      <div className="container-raiz grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="eyebrow">Manifiesto</span>
          <div className="mt-8 space-y-3">
            {lineas.map((l, i) => (
              <Linea key={i} texto={l} i={i} total={lineas.length} progress={scrollYProgress} />
            ))}
          </div>
          <p className="mt-10 font-display text-3xl font-bold text-agua sm:text-5xl">En tu raíz.</p>
        </div>
        <img src="/img/char-lector.svg" alt="Personaje de RAÍZ leyendo con calma" className="mx-auto w-48 animate-float sm:w-64" />
      </div>
    </section>
  );
}
