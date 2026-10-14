'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, Square, RotateCcw, Shuffle, CalendarHeart } from 'lucide-react';
import { frases } from '@/lib/site';
import { mitos, getCorriente } from '@/lib/corrientes';
import { equipo } from '@/lib/equipo';

/* ───────── ¿Cómo llegas hoy? ───────── */
const estados = [
  { e: '😌', t: 'Tranquilo/a', r: 'Qué bien poder notarlo. Guarda este momento: también es información sobre lo que te hace bien.', s: 'Aprovecha para escribir 3 cosas que hoy te sostienen.' },
  { e: '😴', t: 'Cansado/a', r: 'El cansancio también habla. A veces el cuerpo pide pausa antes que la mente.', s: 'Prueba la respiración de abajo y date permiso de descansar sin culpa.' },
  { e: '😰', t: 'Ansioso/a', r: 'La ansiedad es una alarma que se activa para cuidarte, aunque a veces suene muy fuerte.', s: 'Haz 4 ciclos de respiración en caja. Nota 5 cosas que puedes ver a tu alrededor.' },
  { e: '😔', t: 'Triste', r: 'La tristeza no es un error. Muchas veces aparece cuando algo nos importa.', s: 'Si lleva tiempo contigo, hablarlo con alguien puede aliviar. No tienes que hacerlo solo/a.' },
  { e: '😤', t: 'Enojado/a', r: 'El enojo suele avisar que un límite fue cruzado. Escucharlo no es lo mismo que obedecerlo.', s: 'Antes de responder, exhala largo tres veces. Después decide.' },
  { e: '🌀', t: 'Confundido/a', r: 'No todo tiene que estar claro para empezar. La confusión también es un punto de partida.', s: 'Escribe sin filtro durante 3 minutos. A veces el hilo aparece solo.' },
  { e: '🌱', t: 'Con esperanza', r: 'Eso que sientes es una semilla. Cuídala.', s: 'Piensa en un paso pequeño que puedas dar hoy hacia lo que quieres.' },
  { e: '🪨', t: 'Abrumado/a', r: 'Cuando todo pesa a la vez, es normal sentir que no puedes con nada. Paso a paso también es avanzar.', s: 'Elige solo una cosa para hoy. El resto puede esperar.' },
];

export function CheckIn() {
  const [sel, setSel] = useState<number | null>(null);
  const x = sel !== null ? estados[sel] : null;
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {estados.map((s, i) => (
          <button key={s.t} onClick={() => setSel(i)} aria-pressed={sel === i}
            className={`flex items-center gap-2 rounded-full border-2 px-5 py-3 font-display font-bold transition hover:-translate-y-0.5 ${sel === i ? 'border-turquesa bg-turquesa text-white' : 'border-marino/10 bg-white text-marino-900 hover:border-turquesa/50'}`}>
            <span className="text-xl" aria-hidden>{s.e}</span> {s.t}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {x && (
          <motion.div key={x.t} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8 rounded-[2rem] bg-white p-8 shadow-[0_20px_50px_-30px_rgba(28,74,99,.35)]">
            <p className="text-5xl" aria-hidden>{x.e}</p>
            <p className="mt-4 font-display text-2xl font-bold leading-snug text-marino-900">{x.r}</p>
            <p className="mt-4 text-lg text-tinta/75"><strong className="text-turquesa-600">Prueba esto:</strong> {x.s}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────── Respiración guiada ───────── */
const tecnicas = {
  caja: { nombre: 'Respiración en caja', fases: [['Inhala', 4], ['Sostén', 4], ['Exhala', 4], ['Sostén', 4]] as [string, number][] },
  calma: { nombre: 'Respiración 4-7-8', fases: [['Inhala', 4], ['Sostén', 7], ['Exhala', 8]] as [string, number][] },
  suave: { nombre: 'Respiración suave', fases: [['Inhala', 4], ['Exhala', 6]] as [string, number][] },
};
type TecnicaId = keyof typeof tecnicas;

export function Respiracion() {
  const [tec, setTec] = useState<TecnicaId>('caja');
  const [activo, setActivo] = useState(false);
  const [fase, setFase] = useState(0);
  const [seg, setSeg] = useState(0);
  const [ciclos, setCiclos] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>();
  const fases = tecnicas[tec].fases;

  useEffect(() => {
    if (!activo) return;
    timer.current = setInterval(() => {
      setSeg((s) => {
        const dur = fases[fase][1];
        if (s + 1 >= dur) {
          setFase((f) => {
            const nf = (f + 1) % fases.length;
            if (nf === 0) setCiclos((c) => c + 1);
            return nf;
          });
          return 0;
        }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(timer.current);
  }, [activo, fase, fases]);

  const [nombreFase, dur] = fases[fase];
  const escala = !activo ? 0.7 : nombreFase === 'Inhala' ? 1 : nombreFase === 'Exhala' ? 0.6 : fase > 0 && fases[fase - 1][0] === 'Inhala' ? 1 : 0.6;

  function reset() {
    setActivo(false); setFase(0); setSeg(0); setCiclos(0);
  }

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <div className="relative mx-auto grid aspect-square w-full max-w-[380px] place-items-center">
        <div className="absolute inset-0 rounded-full bg-celeste/20" />
        <motion.div
          className="absolute inset-[6%] rounded-full bg-gradient-to-br from-agua to-celeste"
          animate={{ scale: escala }}
          transition={{ duration: activo ? dur : 0.6, ease: 'easeInOut' }}
        />
        <motion.img src="/img/isotipo-white.svg" alt="" className="relative w-1/3" animate={{ rotate: activo ? 360 : 0 }} transition={{ duration: 24, repeat: activo ? Infinity : 0, ease: 'linear' }} />
        <div className="absolute bottom-[14%] text-center">
          <p className="font-display text-2xl font-bold text-marino-900">{activo ? nombreFase : 'Listo/a'}</p>
          {activo && <p className="font-display text-sm font-bold text-marino">{dur - seg}</p>}
        </div>
      </div>
      <div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(tecnicas) as TecnicaId[]).map((k) => (
            <button key={k} onClick={() => { setTec(k); reset(); }} aria-pressed={tec === k}
              className={`rounded-full px-4 py-2 font-display text-sm font-bold transition ${tec === k ? 'bg-marino text-hueso' : 'bg-white text-marino-900 hover:bg-agua-100'}`}>
              {tecnicas[k].nombre}
            </button>
          ))}
        </div>
        <p className="mt-6 text-lg text-tinta/75">
          {fases.map(([n, d]) => `${n} ${d}s`).join(' · ')}. Sigue el círculo: crece cuando inhalas y se encoge cuando exhalas.
        </p>
        <p className="mt-3 font-display font-bold text-turquesa-600">Ciclos completados: {ciclos}</p>
        <div className="mt-6 flex gap-3">
          <button onClick={() => setActivo((a) => !a)} className="btn-primary">
            {activo ? <><Square className="h-4 w-4" /> Pausar</> : <><Play className="h-4 w-4" /> Empezar</>}
          </button>
          <button onClick={reset} className="btn-ghost"><RotateCcw className="h-4 w-4" /> Reiniciar</button>
        </div>
      </div>
    </div>
  );
}

/* ───────── Test: ¿qué corriente va contigo? ───────── */
const test = [
  { q: 'Cuando algo te preocupa, ¿qué te ayuda más?', o: [
    { t: 'Entender de dónde viene, aunque tome tiempo', c: 'psicoanalisis' },
    { t: 'Tener pasos concretos y herramientas prácticas', c: 'cognitivo-conductual' },
    { t: 'Que alguien me escuche sin juzgar', c: 'humanista' },
    { t: 'Ver cómo influyen las personas a mi alrededor', c: 'sistemica' },
  ] },
  { q: 'En una sesión te gustaría…', o: [
    { t: 'Hablar libremente de lo que surja', c: 'psicoanalisis' },
    { t: 'Salir con tareas para practicar', c: 'cognitivo-conductual' },
    { t: 'Conectar con lo que siento en el cuerpo, aquí y ahora', c: 'gestalt' },
    { t: 'Aprender a convivir con lo difícil sin pelear con ello', c: 'contextuales' },
  ] },
  { q: '¿Qué frase te resuena más?', o: [
    { t: '“Lo que no se nombra, se repite.”', c: 'psicoanalisis' },
    { t: '“Cambia tu forma de pensar y cambiará lo que sientes.”', c: 'cognitivo-conductual' },
    { t: '“Nadie sabe más de tu vida que tú.”', c: 'humanista' },
    { t: '“Lo personal también es social.”', c: 'comunitaria' },
  ] },
  { q: 'Lo que más te mueve a buscar ayuda es…', o: [
    { t: 'Conflictos con mi pareja o mi familia', c: 'sistemica' },
    { t: 'Ansiedad, estrés o pensamientos que no paran', c: 'cognitivo-conductual' },
    { t: 'Emociones muy intensas que me desbordan', c: 'contextuales' },
    { t: 'Sentir que algo me falta o que perdí el rumbo', c: 'humanista' },
  ] },
  { q: 'Te imaginas tu proceso como…', o: [
    { t: 'Un viaje largo hacia adentro', c: 'psicoanalisis' },
    { t: 'Un entrenamiento con metas claras', c: 'conductual' },
    { t: 'Un encuentro con mis emociones', c: 'gestalt' },
    { t: 'Un tejido con otras personas', c: 'comunitaria' },
  ] },
];

export function TestCorriente() {
  const [i, setI] = useState(0);
  const [votos, setVotos] = useState<string[]>([]);
  const fin = i >= test.length;

  let ganador = '';
  if (fin) {
    const cuenta: Record<string, number> = {};
    votos.forEach((v) => (cuenta[v] = (cuenta[v] ?? 0) + 1));
    // desempate: preferimos corrientes con alguien del equipo
    ganador = Object.entries(cuenta).sort((a, b) => b[1] - a[1] || Number(equipo.some((p) => p.corriente === b[0])) - Number(equipo.some((p) => p.corriente === a[0])))[0][0];
  }
  const c = fin ? getCorriente(ganador) : null;
  const quienes = equipo.filter((p) => p.corriente === ganador);

  return (
    <div className="card overflow-hidden p-6 sm:p-10">
      <AnimatePresence mode="wait">
        {!fin ? (
          <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <p className="font-display text-sm font-bold text-turquesa-600">Pregunta {i + 1} de {test.length}</p>
            <h3 className="mt-3 font-display text-2xl font-bold text-marino-900 sm:text-3xl">{test[i].q}</h3>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {test[i].o.map((o) => (
                <button key={o.t} onClick={() => { setVotos([...votos, o.c]); setI(i + 1); }}
                  className="rounded-2xl border-2 border-marino/10 bg-white px-5 py-4 text-left font-semibold transition hover:-translate-y-0.5 hover:border-turquesa">
                  {o.t}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          c && (
            <motion.div key="fin" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <p className="font-display text-sm font-bold uppercase tracking-widest text-turquesa-600">Podría resonarte</p>
              <h3 className="mt-3 font-display text-3xl font-bold text-marino-900 sm:text-4xl">{c.nombre}</h3>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-tinta/75">{c.idea}</p>
              {quienes.length > 0 && (
                <p className="mt-6 text-tinta/75">En RAÍZ trabaja desde aquí: {quienes.map((p) => p.nombre).join(', ')}.</p>
              )}
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                {quienes[0] ? (
                  <Link href={`/agenda?psicologo=${quienes[0].id}`} className="btn-turquesa"><CalendarHeart className="h-4 w-4" /> Agendar con {quienes[0].nombre.split(' ')[0]}</Link>
                ) : (
                  <Link href="/agenda" className="btn-turquesa"><CalendarHeart className="h-4 w-4" /> Agendar un turno</Link>
                )}
                <Link href={`/psicologia#${c.slug}`} className="btn-ghost">Leer sobre esta corriente</Link>
                <button onClick={() => { setI(0); setVotos([]); }} className="btn-ghost"><RotateCcw className="h-4 w-4" /> Repetir</button>
              </div>
              <p className="mt-6 text-sm text-tinta/50">Es un juego para orientarte, no un diagnóstico. En la primera sesión lo conversamos mejor.</p>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────── Mitos y realidades ───────── */
export function Mitos() {
  const [vuelta, setVuelta] = useState<Record<number, boolean>>({});
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {mitos.map((m, i) => (
        <button key={i} onClick={() => setVuelta({ ...vuelta, [i]: !vuelta[i] })} className="group h-56 [perspective:1000px]" aria-label={vuelta[i] ? m.realidad : `Mito: ${m.mito}. Toca para ver la realidad.`}>
          <div className={`relative h-full w-full rounded-[2rem] transition duration-700 [transform-style:preserve-3d] ${vuelta[i] ? '[transform:rotateY(180deg)]' : ''}`}>
            <div className="absolute inset-0 flex flex-col justify-between rounded-[2rem] bg-marino p-7 text-left text-hueso [backface-visibility:hidden]">
              <span className="font-display text-xs font-bold uppercase tracking-widest text-celeste">Mito</span>
              <p className="font-display text-xl font-bold leading-snug">{m.mito}</p>
              <span className="text-sm text-hueso/60">Toca para ver la realidad ↻</span>
            </div>
            <div className="absolute inset-0 flex flex-col justify-between rounded-[2rem] bg-agua p-7 text-left text-marino-900 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <span className="font-display text-xs font-bold uppercase tracking-widest text-marino">Realidad</span>
              <p className="text-lg font-semibold leading-snug">{m.realidad}</p>
              <span className="text-sm text-marino-900/60">↻</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

/* ───────── Frase para hoy ───────── */
export function FraseDelDia() {
  const [i, setI] = useState(0);
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-marino-900 px-6 py-16 text-center text-hueso sm:px-12">
      <div className="pattern-iso absolute inset-0" aria-hidden />
      <AnimatePresence mode="wait">
        <motion.p key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="relative mx-auto max-w-2xl font-display text-3xl font-bold leading-snug sm:text-4xl">
          “{frases[i]}”
        </motion.p>
      </AnimatePresence>
      <button onClick={() => setI((i + 1 + Math.floor(Math.random() * (frases.length - 1))) % frases.length)} className="btn-light relative mt-10">
        <Shuffle className="h-4 w-4" /> Otra frase para ti
      </button>
    </div>
  );
}
