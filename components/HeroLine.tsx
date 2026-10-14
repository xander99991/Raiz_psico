'use client';
import { motion, useReducedMotion } from 'framer-motion';

/** Del nudo al trazo continuo: el hilo se desenreda al cargar la página */
export function HeroLine() {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-6 hidden h-32 w-full sm:block" aria-hidden>
      <motion.path
        d="M-20 120 C 40 60, 90 150, 120 100 C 150 50, 60 60, 90 110 C 120 160, 180 90, 150 70 C 120 50, 100 130, 160 120 C 260 100, 380 40, 520 80 S 760 140, 900 90 S 1100 30, 1180 80 C 1240 120, 1320 120, 1340 80 C 1360 40, 1300 30, 1290 70 C 1282 100, 1330 100, 1335 75"
        fill="none"
        stroke="#99D0A9"
        strokeWidth="4"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.9 }}
        transition={{ duration: 3.2, ease: 'easeInOut', delay: 0.5 }}
      />
    </svg>
  );
}
