'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarHeart, ChevronLeft, ChevronRight, Check, Clock, Download, Loader2, MapPin, MessageCircle, UserRound, Wallet } from 'lucide-react';
import { equipo, getPsicologo, modalidades, type Modalidad } from '@/lib/equipo';
import { getCorriente } from '@/lib/corrientes';
import { formatLong, monthLabel, shiftMonth, todayEC, addDays, weekday, monthDates } from '@/lib/agenda';
import { site } from '@/lib/site';
import { Calculadora, leerTarifa, type ResultadoTarifa } from './Calculadora';
import { Avatar } from './ui';

type Hora = { hour: string; psychologists: string[] };
type Dias = Record<string, { total: number; horas: Hora[] }>;
type Confirmacion = { id: string; psychologist: string; price: number };

const DIAS_CORTOS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

function Paso({ n, titulo, listo, children }: { n: number; titulo: string; listo?: boolean; children: React.ReactNode }) {
  return (
    <section className="card p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-sm font-bold ${listo ? 'bg-turquesa text-white' : 'bg-marino/10 text-marino'}`}>
          {listo ? <Check className="h-4 w-4" /> : n}
        </span>
        <h2 className="font-display text-xl font-bold text-marino-900 sm:text-2xl">{titulo}</h2>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function Agenda({ psicologoInicial }: { psicologoInicial?: string }) {
  const [tarifa, setTarifa] = useState<ResultadoTarifa | null>(null);
  const [cargada, setCargada] = useState(false);
  const [psico, setPsico] = useState<string>(psicologoInicial && getPsicologo(psicologoInicial) ? psicologoInicial : 'any');
  const [modalidad, setModalidad] = useState<Modalidad>('online');
  const [mes, setMes] = useState(todayEC().slice(0, 7));
  const [dias, setDias] = useState<Dias>({});
  const [cargando, setCargando] = useState(false);
  const [errorAgenda, setErrorAgenda] = useState('');
  const [fecha, setFecha] = useState<string | null>(null);
  const [hora, setHora] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', reason: '', acepto: false });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState<Confirmacion | null>(null);

  useEffect(() => {
    setTarifa(leerTarifa());
    setCargada(true);
  }, []);

  // Si el psicólogo no ofrece la modalidad elegida, cambiamos a una que sí ofrezca
  useEffect(() => {
    const p = getPsicologo(psico);
    if (p && !p.modalidades.includes(modalidad)) setModalidad(p.modalidades[0]);
  }, [psico, modalidad]);

  const cargar = useCallback(async () => {
    setCargando(true);
    setErrorAgenda('');
    try {
      const r = await fetch(`/api/disponibilidad?month=${mes}&psychologist=${psico}&modality=${modalidad}`, { cache: 'no-store' });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setDias(j.days);
    } catch (e) {
      setErrorAgenda(e instanceof Error && e.message ? e.message : 'No pudimos cargar la agenda.');
      setDias({});
    } finally {
      setCargando(false);
    }
  }, [mes, psico, modalidad]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Al cambiar filtros, limpiamos la selección si ya no es válida
  useEffect(() => {
    if (fecha && !fecha.startsWith(mes)) return;
    if (fecha && hora) {
      const h = dias[fecha]?.horas.find((x) => x.hour === hora);
      if (!h || h.psychologists.length === 0) setHora(null);
    }
  }, [dias]); // eslint-disable-line react-hooks/exhaustive-deps

  const hoy = todayEC();
  const mesMin = hoy.slice(0, 7);
  const mesMax = addDays(hoy, site.maxDaysAhead).slice(0, 7);

  const celdas = useMemo(() => {
    const fechas = monthDates(mes);
    const offset = (weekday(fechas[0]) + 6) % 7; // lunes primero
    return [...Array(offset).fill(null), ...fechas] as (string | null)[];
  }, [mes]);

  const horasDia = fecha ? dias[fecha]?.horas ?? [] : [];
  const psicoFinal = psico !== 'any' ? getPsicologo(psico) : null;
  const listoPaso1 = !!tarifa;
  const listoPaso3 = !!fecha && !!hora;

  async function reservar(e: React.FormEvent) {
    e.preventDefault();
    if (!tarifa || !fecha || !hora) return;
    setEnviando(true);
    setError('');
    try {
      const r = await fetch('/api/turnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ psychologistId: psico, modality: modalidad, date: fecha, hour: hora, name: form.name, email: form.email, phone: form.phone, reason: form.reason, answers: tarifa.answers }),
      });
      const j = await r.json();
      if (!r.ok) {
        setError(j.error ?? 'No pudimos reservar.');
        if (r.status === 409) {
          setHora(null);
          cargar();
        }
        return;
      }
      setOk({ id: j.id, psychologist: j.psychologist, price: j.price });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('Sin conexión. Revisa tu internet e intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  if (ok && fecha && hora) return <Exito ok={ok} fecha={fecha} hora={hora} modalidad={modalidad} nombre={form.name} />;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
      <div className="space-y-6">
        {/* PASO 1 · TARIFA */}
        <Paso n={1} titulo="Tu tarifa" listo={listoPaso1}>
          {!cargada ? null : tarifa ? (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-agua-100 p-5">
              <div>
                <p className="font-display font-bold text-marino-900">{tarifa.nombre}</p>
                <p className="text-sm text-tinta/70">${tarifa.precio} por sesión de {site.sessionMinutes} min</p>
              </div>
              <button onClick={() => setTarifa(null)} className="text-sm font-bold text-marino underline underline-offset-4">Volver a calcular</button>
            </div>
          ) : (
            <>
              <p className="mb-5 text-tinta/75">Responde 4 preguntas rápidas para saber cuánto cuesta tu cita.</p>
              <Calculadora embedded onDone={(r) => setTarifa(r)} />
            </>
          )}
        </Paso>

        {/* PASO 2 · CON QUIÉN */}
        <Paso n={2} titulo="¿Con quién y cómo?" listo={listoPaso1}>
          <div className="grid gap-3 sm:grid-cols-2">
            <button onClick={() => setPsico('any')} aria-pressed={psico === 'any'}
              className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${psico === 'any' ? 'border-turquesa bg-turquesa-100' : 'border-marino/10 bg-white hover:border-turquesa/50'}`}>
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-hueso-200"><img src="/img/isotipo.svg" alt="" className="h-9" /></span>
              <span><span className="block font-display font-bold text-marino-900">Quien tenga espacio</span><span className="text-sm text-tinta/60">Más horarios disponibles</span></span>
            </button>
            {equipo.map((p) => (
              <button key={p.id} onClick={() => setPsico(p.id)} aria-pressed={psico === p.id}
                className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${psico === p.id ? 'border-turquesa bg-turquesa-100' : 'border-marino/10 bg-white hover:border-turquesa/50'}`}>
                <Avatar nombre={p.nombre} color={p.color} />
                <span><span className="block font-display font-bold text-marino-900">{p.nombre}</span><span className="text-sm text-tinta/60">{getCorriente(p.corriente)?.nombre}</span></span>
              </button>
            ))}
          </div>
          <p className="mb-3 mt-7 font-display text-sm font-bold text-marino-900">Modalidad</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(modalidades) as Modalidad[]).map((m) => {
              const disponible = psico === 'any' || getPsicologo(psico)?.modalidades.includes(m);
              return (
                <button key={m} disabled={!disponible} onClick={() => setModalidad(m)} aria-pressed={modalidad === m}
                  className={`rounded-full px-5 py-2.5 font-display text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-35 ${modalidad === m ? 'bg-marino text-hueso' : 'bg-white text-marino-900 hover:bg-agua-100'}`}>
                  {modalidades[m]}
                </button>
              );
            })}
          </div>
        </Paso>

        {/* PASO 3 · FECHA Y HORA */}
        <Paso n={3} titulo="Elige día y hora" listo={listoPaso3}>
          <div className="flex items-center justify-between">
            <button onClick={() => { setMes(shiftMonth(mes, -1)); }} disabled={mes <= mesMin} className="grid h-10 w-10 place-items-center rounded-full hover:bg-agua-100 disabled:opacity-30" aria-label="Mes anterior">
              <ChevronLeft className="h-5 w-5 text-marino" />
            </button>
            <p className="flex items-center gap-2 font-display text-lg font-bold first-letter:uppercase text-marino-900">
              {monthLabel(mes)} {cargando && <Loader2 className="h-4 w-4 animate-spin text-turquesa" />}
            </p>
            <button onClick={() => { setMes(shiftMonth(mes, 1)); }} disabled={mes >= mesMax} className="grid h-10 w-10 place-items-center rounded-full hover:bg-agua-100 disabled:opacity-30" aria-label="Mes siguiente">
              <ChevronRight className="h-5 w-5 text-marino" />
            </button>
          </div>

          {errorAgenda && <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{errorAgenda}</p>}

          <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
            {DIAS_CORTOS.map((d) => <span key={d} className="py-1 font-display text-xs font-bold text-tinta/45">{d}</span>)}
            {celdas.map((f, i) => {
              if (!f) return <span key={`v${i}`} />;
              const info = dias[f];
              const libres = info?.horas.filter((h) => h.psychologists.length > 0).length ?? 0;
              const atiende = (info?.total ?? 0) > 0;
              const lleno = atiende && libres === 0;
              const sel = fecha === f;
              const dia = Number(f.slice(8));
              return (
                <button
                  key={f}
                  disabled={!atiende || lleno}
                  onClick={() => { setFecha(f); setHora(null); }}
                  aria-pressed={sel}
                  aria-label={`${formatLong(f)}${lleno ? ', lleno' : libres ? `, ${libres} horarios libres` : ', sin atención'}`}
                  className={`relative flex aspect-square flex-col items-center justify-center rounded-xl font-display text-sm font-bold transition sm:rounded-2xl sm:text-base ${
                    sel ? 'bg-marino text-hueso shadow-lg'
                      : lleno ? 'cursor-not-allowed bg-marino/5 text-tinta/30 line-through'
                      : atiende ? 'bg-turquesa-100 text-marino-900 hover:bg-turquesa hover:text-white'
                      : 'cursor-default text-tinta/25'
                  }`}
                >
                  {dia}
                  {atiende && !lleno && <span className={`mt-0.5 h-1.5 w-1.5 rounded-full ${sel ? 'bg-agua' : 'bg-turquesa'}`} />}
                  {lleno && <span className="text-[9px] font-bold uppercase no-underline sm:text-[10px]">lleno</span>}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-tinta/60">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-turquesa-100" /> Con horarios libres</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-marino/10" /> Lleno</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-marino/10" /> Sin atención</span>
          </div>

          <AnimatePresence>
            {fecha && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <p className="mt-7 font-display font-bold first-letter:uppercase text-marino-900">{formatLong(fecha)}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {horasDia.map((h) => {
                    const libre = h.psychologists.length > 0;
                    return (
                      <button key={h.hour} disabled={!libre} onClick={() => setHora(h.hour)} aria-pressed={hora === h.hour}
                        className={`rounded-xl px-3 py-3 font-display text-sm font-bold transition ${
                          hora === h.hour ? 'bg-turquesa text-white shadow-md'
                            : libre ? 'border-2 border-turquesa/30 bg-white text-marino-900 hover:border-turquesa'
                            : 'cursor-not-allowed bg-marino/5 text-tinta/35'
                        }`}>
                        {h.hour}
                        <span className="block text-[10px] font-semibold opacity-70">{libre ? (psico === 'any' && h.psychologists.length > 1 ? `${h.psychologists.length} libres` : 'Libre') : 'Ocupado'}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Paso>

        {/* PASO 4 · DATOS */}
        <Paso n={4} titulo="Tus datos">
          <form onSubmit={reservar} className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="name">Nombre y apellido</label>
              <input id="name" required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
            </div>
            <div>
              <label className="label" htmlFor="email">Correo</label>
              <input id="email" type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
            </div>
            <div>
              <label className="label" htmlFor="phone">WhatsApp</label>
              <input id="phone" type="tel" required className="input" placeholder="09X XXX XXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="reason">¿Quieres contarnos algo antes? <span className="font-normal text-tinta/50">(opcional)</span></label>
              <textarea id="reason" rows={3} className="input resize-none" placeholder="Puedes escribir solo una palabra, o nada." value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            </div>
            <label className="flex items-start gap-3 text-sm text-tinta/75 sm:col-span-2">
              <input type="checkbox" required checked={form.acepto} onChange={(e) => setForm({ ...form, acepto: e.target.checked })} className="mt-1 h-4 w-4 accent-turquesa" />
              Acepto que RAÍZ use estos datos solo para gestionar mi cita y contactarme. Son confidenciales.
            </label>
            {error && <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700 sm:col-span-2">{error}</p>}
            <button type="submit" disabled={!tarifa || !fecha || !hora || enviando} className="btn-turquesa !py-4 text-base sm:col-span-2">
              {enviando ? <Loader2 className="h-5 w-5 animate-spin" /> : <CalendarHeart className="h-5 w-5" />}
              {!tarifa ? 'Primero calcula tu tarifa' : !fecha || !hora ? 'Elige día y hora' : 'Reservar mi turno'}
            </button>
          </form>
        </Paso>
      </div>

      {/* RESUMEN */}
      <aside className="card p-6 lg:sticky lg:top-28">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-turquesa-600">Tu turno</p>
        <ul className="mt-5 space-y-4 text-sm">
          <li className="flex gap-3"><Wallet className="h-5 w-5 shrink-0 text-marino" /><span>{tarifa ? `${tarifa.nombre} · $${tarifa.precio}` : <span className="text-tinta/45">Tarifa por calcular</span>}</span></li>
          <li className="flex gap-3"><UserRound className="h-5 w-5 shrink-0 text-marino" /><span>{psicoFinal ? psicoFinal.nombre : 'Quien tenga espacio'}</span></li>
          <li className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-marino" /><span>{modalidades[modalidad]}</span></li>
          <li className="flex gap-3"><Clock className="h-5 w-5 shrink-0 text-marino" /><span className="inline-block first-letter:uppercase">{fecha && hora ? `${formatLong(fecha)} · ${hora}` : <span className="normal-case text-tinta/45">Día y hora por elegir</span>}</span></li>
        </ul>
        <div className="mt-6 border-t border-marino/10 pt-5">
          <p className="flex items-baseline justify-between font-display font-bold text-marino-900">
            Total <span className="text-3xl">{tarifa ? `$${tarifa.precio}` : '—'}</span>
          </p>
          <p className="mt-1 text-xs text-tinta/55">Pagas el día de tu sesión. Te confirmamos por WhatsApp.</p>
        </div>
      </aside>
    </div>
  );
}

function Exito({ ok, fecha, hora, modalidad, nombre }: { ok: Confirmacion; fecha: string; hora: string; modalidad: Modalidad; nombre: string }) {
  const texto = `Hola RAÍZ 🌱, soy ${nombre}. Acabo de reservar un turno para el ${formatLong(fecha)} a las ${hora} (${modalidades[modalidad]}) con ${ok.psychologist}. Código: ${ok.id.slice(-6).toUpperCase()}`;
  function ics() {
    const start = new Date(`${fecha}T${hora}:00-05:00`);
    const end = new Date(start.getTime() + site.sessionMinutes * 60000);
    const f = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//RAIZ//Agenda//ES', 'BEGIN:VEVENT', `UID:${ok.id}@raiz`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(start)}`, `DTEND:${f(end)}`, `SUMMARY:Sesión RAÍZ con ${ok.psychologist}`, `LOCATION:${modalidades[modalidad]}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([body], { type: 'text/calendar' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'turno-raiz.ics'; a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card mx-auto max-w-2xl p-8 text-center sm:p-12">
      <img src="/img/char-plantando.svg" alt="" className="mx-auto w-52" />
      <p className="mt-6 font-display text-sm font-bold uppercase tracking-[0.25em] text-turquesa-600">Turno reservado</p>
      <h2 className="mt-3 font-display text-3xl font-bold text-marino-900 sm:text-4xl">Gracias por dar este paso, {nombre.split(' ')[0]}</h2>
      <div className="mx-auto mt-8 max-w-md space-y-2 rounded-3xl bg-agua-100 p-6 text-left text-marino-900">
        <p><strong>Cuándo:</strong> <span className="inline-block first-letter:uppercase">{formatLong(fecha)}</span>, {hora}</p>
        <p><strong>Con:</strong> {ok.psychologist}</p>
        <p><strong>Modalidad:</strong> {modalidades[modalidad]}</p>
        <p><strong>Valor:</strong> ${ok.price}</p>
        <p><strong>Código:</strong> {ok.id.slice(-6).toUpperCase()}</p>
      </div>
      <p className="mt-6 text-tinta/70">Te escribiremos para confirmar. Si quieres, avísanos ahora por WhatsApp.</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(texto)}`} target="_blank" rel="noopener noreferrer" className="btn-turquesa">
          <MessageCircle className="h-4 w-4" /> Confirmar por WhatsApp
        </a>
        <button onClick={ics} className="btn-ghost"><Download className="h-4 w-4" /> Añadir a mi calendario</button>
      </div>
      <Link href="/rincon" className="mt-8 inline-block text-sm font-bold text-marino underline underline-offset-4">Mientras tanto, visita el Rincón Raíz</Link>
    </motion.div>
  );
}
