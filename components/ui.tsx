'use client';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

export function Reveal({ children, delay = 0, className = '', y = 24 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionTitle({ eyebrow, title, intro, center = false, light = false }: { eyebrow?: string; title: ReactNode; intro?: ReactNode; center?: boolean; light?: boolean }) {
  return (
    <Reveal className={`${center ? 'mx-auto text-center' : ''} max-w-2xl`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className={`h-display mt-5 text-3xl leading-[1.15] sm:text-4xl md:text-[2.75rem] ${light ? '!text-hueso' : ''}`}>{title}</h2>
      {intro && <p className={`mt-5 text-lg leading-relaxed ${light ? 'text-hueso/80' : 'text-tinta/75'}`}>{intro}</p>}
    </Reveal>
  );
}

/** Trazo continuo que se dibuja al aparecer — inspirado en el logotipo */
export function Hilo({ className = '', color = '#78CDD0' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={`h-16 w-full ${className}`} aria-hidden>
      <motion.path
        d="M0 60 C 150 10, 260 110, 400 60 S 560 0, 640 50 C 700 90, 760 95, 790 60 C 820 25, 780 5, 760 30 C 740 55, 800 80, 860 62 S 1050 20, 1200 60"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.2, ease: 'easeInOut' }}
      />
    </svg>
  );
}

const avatarColors = {
  marino: 'bg-marino text-hueso',
  turquesa: 'bg-turquesa text-white',
  celeste: 'bg-celeste text-marino-900',
  agua: 'bg-agua text-marino-900',
} as const;

export function Avatar({ nombre, color, size = 'md' }: { nombre: string; color: keyof typeof avatarColors; size?: 'md' | 'lg' }) {
  const ini = nombre.split(' ').filter(Boolean).slice(0, 2).map((s) => s[0]).join('');
  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden font-display font-bold ${avatarColors[color]} ${
        size === 'lg' ? 'h-28 w-28 text-3xl' : 'h-16 w-16 text-xl'
      }`}
      style={{ borderRadius: '58% 42% 55% 45% / 48% 55% 45% 52%' }}
      aria-hidden
    >
      <span className="relative z-10">{ini}</span>
      <img src="/img/isotipo-white.svg" alt="" className="absolute -bottom-3 -right-3 h-3/4 opacity-20" />
    </div>
  );
}
