'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Download, Loader2, LogOut, MessageCircle, Mail, Trash2, RefreshCw } from 'lucide-react';
import { equipo, getPsicologo, modalidades, type Modalidad } from '@/lib/equipo';
import { formatLong, todayEC } from '@/lib/agenda';

type Turno = { id: string; psychologistId: string; start: string; modality: string; name: string; email: string; phone: string; reason: string | null; tier: string; price: number; status: string; createdAt: string };
type Bloqueo = { id: string; psychologistId: string; date: string; hour: string | null; reason: string | null };

const ESTADOS: Record<string, string> = { pendiente: 'bg-amber-100 text-amber-800', confirmada: 'bg-turquesa-100 text-turquesa-600', atendida: 'bg-marino-50 text-marino', cancelada: 'bg-red-50 text-red-600' };
const ec = (iso: string) => new Date(new Date(iso).getTime() - 5 * 3600e3).toISOString();
const telWa = (t: string) => { const d = t.replace(/\D/g, ''); return d.startsWith('0') ? `593${d.slice(1)}` : d; };

export function Admin() {
  const [auth, setAuth] = useState<'?' | 'no' | 'si'>('?');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [tab, setTab] = useState<'proximos' | 'todos' | 'bloqueos'>('proximos');
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [bloqueos, setBloqueos] = useState<Bloqueo[]>([]);
  const [filtro, setFiltro] = useState('todos');
  const [cargando, setCargando] = useState(false);
  const [nb, setNb] = useState({ psychologistId: 'todos', date: todayEC(), hour: '', reason: '' });

  const cargar = useCallback(async () => {
    setCargando(true);
    const scope = tab === 'todos' ? 'todos' : 'proximos';
    const [r1, r2] = await Promise.all([fetch(`/api/admin/turnos?scope=${scope}`, { cache: 'no-store' }), fetch('/api/admin/bloqueos', { cache: 'no-store' })]);
    if (r1.status === 401) { setAuth('no'); setCargando(false); return; }
    setAuth('si');
    setTurnos((await r1.json()).turnos ?? []);
    setBloqueos((await r2.json()).bloqueos ?? []);
    setCargando(false);
  }, [tab]);

  useEffect(() => { cargar(); }, [cargar]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pass }) });
    if (!r.ok) { setErr((await r.json()).error ?? 'Error'); return; }
    setPass('');
    cargar();
  }

  async function estado(id: string, status: string) {
    const r = await fetch('/api/admin/turnos', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    const j = await r.json();
    if (!r.ok) return alert(j.error);
    setTurnos((ts) => ts.map((t) => (t.id === id ? { ...t, status: j.turno.status } : t)));
  }

  async function bloquear(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch('/api/admin/bloqueos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nb) });
    if (r.ok) { setNb({ ...nb, hour: '', reason: '' }); cargar(); }
  }
  async function desbloquear(id: string) {
    await fetch(`/api/admin/bloqueos?id=${id}`, { method: 'DELETE' });
    cargar();
  }

  const lista = useMemo(() => turnos.filter((t) => filtro === 'todos' || t.psychologistId === filtro), [turnos, filtro]);
  const porDia = useMemo(() => {
    const m = new Map<string, Turno[]>();
    lista.forEach((t) => { const d = ec(t.start).slice(0, 10); m.set(d, [...(m.get(d) ?? []), t]); });
    return [...m.entries()];
  }, [lista]);
  const activos = lista.filter((t) => t.status !== 'cancelada');
  const stats = [
    { l: 'Turnos activos', v: activos.length },
    { l: 'Por confirmar', v: lista.filter((t) => t.status === 'pendiente').length },
    { l: 'Tarifa social', v: activos.filter((t) => t.tier === 'social').length },
    { l: 'Ingreso estimado', v: `$${activos.reduce((s, t) => s + t.price, 0)}` },
  ];

  function csv() {
    const rows = [['Fecha', 'Hora', 'Psicólogo', 'Modalidad', 'Nombre', 'Correo', 'Teléfono', 'Tarifa', 'Valor', 'Estado', 'Motivo']];
    lista.forEach((t) => { const d = ec(t.start); rows.push([d.slice(0, 10), d.slice(11, 16), getPsicologo(t.psychologistId)?.nombre ?? t.psychologistId, modalidades[t.modality as Modalidad] ?? t.modality, t.name, t.email, t.phone, t.tier, String(t.price), t.status, t.reason ?? '']); });
    const body = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + body], { type: 'text/csv' }));
    a.download = `turnos-raiz-${todayEC()}.csv`; a.click();
  }

  if (auth === '?') return <div className="grid min-h-screen place-items-center"><Loader2 className="h-8 w-8 animate-spin text-turquesa" /></div>;

  if (auth === 'no')
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <form onSubmit={login} className="card w-full max-w-sm p-8">
          <Image src="/img/logo.svg" alt="RAÍZ" width={140} height={92} className="mx-auto h-auto w-32" />
          <h1 className="mt-6 text-center font-display text-xl font-bold text-marino-900">Panel de turnos</h1>
          <label className="label mt-6" htmlFor="pw">Contraseña</label>
          <input id="pw" type="password" className="input" value={pass} onChange={(e) => setPass(e.target.value)} autoFocus />
          {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
          <button className="btn-primary mt-6 w-full">Entrar</button>
        </form>
      </div>
    );

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-20 border-b border-marino/10 bg-hueso/90 backdrop-blur">
        <div className="container-raiz flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Image src="/img/logo.svg" alt="RAÍZ" width={90} height={60} className="h-auto w-20" />
            <span className="hidden font-display font-bold text-marino-900 sm:inline">Panel de turnos</span>
          </div>
          <div className="flex gap-2">
            <button onClick={cargar} className="btn-ghost !px-4 !py-2" aria-label="Actualizar">{cargando ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}</button>
            <button onClick={async () => { await fetch('/api/admin/login', { method: 'DELETE' }); setAuth('no'); }} className="btn-ghost !px-4 !py-2"><LogOut className="h-4 w-4" /> Salir</button>
          </div>
        </div>
      </header>

      <div className="container-raiz mt-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s) => <div key={s.l} className="card p-5"><p className="text-xs font-bold uppercase tracking-wider text-tinta/50">{s.l}</p><p className="mt-1 font-display text-3xl font-bold text-marino-900">{s.v}</p></div>)}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {(['proximos', 'todos', 'bloqueos'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 font-display text-sm font-bold ${tab === t ? 'bg-marino text-hueso' : 'bg-white text-marino-900'}`}>
              {t === 'proximos' ? 'Próximos turnos' : t === 'todos' ? 'Historial' : 'Bloquear horarios'}
            </button>
          ))}
          {tab !== 'bloqueos' && (
            <>
              <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="input !w-auto !py-2 text-sm">
                <option value="todos">Todo el equipo</option>
                {equipo.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
              <button onClick={csv} className="btn-ghost !px-4 !py-2 text-sm"><Download className="h-4 w-4" /> Excel (CSV)</button>
            </>
          )}
        </div>

        {tab !== 'bloqueos' ? (
          <div className="mt-6 space-y-8">
            {porDia.length === 0 && <p className="card p-8 text-center text-tinta/60">Aún no hay turnos aquí.</p>}
            {porDia.map(([dia, ts]) => (
              <div key={dia}>
                <h2 className="font-display font-bold first-letter:uppercase text-marino-900">{formatLong(dia)}</h2>
                <div className="mt-3 space-y-3">
                  {ts.map((t) => (
                    <div key={t.id} className="card grid gap-4 p-5 md:grid-cols-[90px_1.2fr_1fr_auto] md:items-center">
                      <p className="font-display text-2xl font-bold text-marino">{ec(t.start).slice(11, 16)}</p>
                      <div>
                        <p className="font-bold text-marino-900">{t.name}</p>
                        <p className="text-sm text-tinta/60">{getPsicologo(t.psychologistId)?.nombre} · {modalidades[t.modality as Modalidad] ?? t.modality}</p>
                        {t.reason && <p className="mt-1 text-sm italic text-tinta/60">“{t.reason}”</p>}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <a href={`https://wa.me/${telWa(t.phone)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-semibold text-turquesa-600"><MessageCircle className="h-4 w-4" />{t.phone}</a>
                        <a href={`mailto:${t.email}`} className="flex items-center gap-1 text-marino"><Mail className="h-4 w-4" />{t.email}</a>
                        <span className="rounded-full bg-agua-100 px-2.5 py-0.5 text-xs font-bold text-marino-900">{t.tier} · ${t.price}</span>
                      </div>
                      <select value={t.status} onChange={(e) => estado(t.id, e.target.value)} className={`rounded-full border-0 px-3 py-2 text-sm font-bold ${ESTADOS[t.status]}`}>
                        {Object.keys(ESTADOS).map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
            <form onSubmit={bloquear} className="card space-y-4 p-6">
              <p className="text-sm text-tinta/70">Bloquea un día completo (vacaciones, feriados) o una hora puntual. Esos horarios dejarán de aparecer en la web.</p>
              <div><label className="label">Psicólogo</label>
                <select className="input" value={nb.psychologistId} onChange={(e) => setNb({ ...nb, psychologistId: e.target.value })}>
                  <option value="todos">Todo el equipo</option>
                  {equipo.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select></div>
              <div><label className="label">Fecha</label><input type="date" className="input" value={nb.date} onChange={(e) => setNb({ ...nb, date: e.target.value })} required /></div>
              <div><label className="label">Hora (vacío = todo el día)</label><input type="time" step={3600} className="input" value={nb.hour} onChange={(e) => setNb({ ...nb, hour: e.target.value })} /></div>
              <div><label className="label">Motivo (opcional)</label><input className="input" value={nb.reason} onChange={(e) => setNb({ ...nb, reason: e.target.value })} /></div>
              <button className="btn-primary w-full">Bloquear</button>
            </form>
            <div className="space-y-3">
              {bloqueos.length === 0 && <p className="card p-8 text-center text-tinta/60">No hay bloqueos próximos.</p>}
              {bloqueos.map((b) => (
                <div key={b.id} className="card flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="font-bold first-letter:uppercase text-marino-900">{formatLong(b.date)} · {b.hour || 'Todo el día'}</p>
                    <p className="text-sm text-tinta/60">{b.psychologistId === 'todos' ? 'Todo el equipo' : getPsicologo(b.psychologistId)?.nombre}{b.reason ? ` · ${b.reason}` : ''}</p>
                  </div>
                  <button onClick={() => desbloquear(b.id)} className="grid h-10 w-10 place-items-center rounded-full text-red-500 hover:bg-red-50" aria-label="Quitar bloqueo"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
