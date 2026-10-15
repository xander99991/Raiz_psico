'use client';
import { useRef, useState } from 'react';
import { Camera, Check, Copy, Loader2, Send } from 'lucide-react';
import { corrientes } from '@/lib/corrientes';
import { modalidades } from '@/lib/equipo';
import { DIAS_FICHA, HORAS_FICHA, POBLACIONES_FICHA, TEMAS_FICHA, type Ficha } from '@/lib/ficha';

const vacia: Ficha = {
  nombre: '', nombreWeb: '', titulo: '', senescyt: '', mostrarSenescyt: true, formacion: '', experiencia: '',
  corriente: '', corrienteOtra: '', complementarias: [], frase: '', bio: '', temas: [], temasOtros: '',
  poblaciones: [], idiomas: 'Español', modalidades: [], horario: {}, email: '', whatsapp: '', redes: '',
  comentarios: '', consentimiento: false,
};

/** Reduce la foto a 640×640 (recorte cuadrado centrado) en WebP para que pese poco */
async function comprimir(file: File): Promise<string> {
  const img = await createImageBitmap(file);
  const lado = Math.min(img.width, img.height);
  const c = document.createElement('canvas');
  c.width = c.height = 640;
  c.getContext('2d')!.drawImage(img, (img.width - lado) / 2, (img.height - lado) / 2, lado, lado, 0, 0, 640, 640);
  let q = 0.85;
  let url = c.toDataURL('image/webp', q);
  while (url.length > 600_000 && q > 0.4) url = c.toDataURL('image/webp', (q -= 0.1));
  return url;
}

function Seccion({ n, titulo, ayuda, children }: { n: number; titulo: string; ayuda?: string; children: React.ReactNode }) {
  return (
    <section className="card p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-agua-100 font-display text-sm font-bold text-marino">{n}</span>
        <h2 className="font-display text-xl font-bold text-marino-900 sm:text-2xl">{titulo}</h2>
      </div>
      {ayuda && <p className="mt-2 text-sm text-tinta/60">{ayuda}</p>}
      <div className="mt-6 grid gap-5">{children}</div>
    </section>
  );
}

function Chips({ opciones, valor, onChange }: { opciones: { id: string; label: string }[]; valor: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map((o) => {
        const on = valor.includes(o.id);
        return (
          <button type="button" key={o.id} aria-pressed={on} onClick={() => onChange(on ? valor.filter((x) => x !== o.id) : [...valor, o.id])}
            className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition ${on ? 'border-turquesa bg-turquesa text-white' : 'border-marino/10 bg-white text-marino-900 hover:border-turquesa/50'}`}>
            {on && <Check className="-ml-1 mr-1 inline h-3.5 w-3.5" />}{o.label}
          </button>
        );
      })}
    </div>
  );
}

export function FichaEquipo() {
  const [f, setF] = useState<Ficha>(vacia);
  const [foto, setFoto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof Ficha>(k: K, v: Ficha[K]) => setF((x) => ({ ...x, [k]: v }));

  function toggleHora(d: number, h: string) {
    const actual = f.horario[d] ?? [];
    set('horario', { ...f.horario, [d]: actual.includes(h) ? actual.filter((x) => x !== h) : [...actual, h].sort() });
  }
  function copiarLunes() {
    const lun = f.horario[1] ?? [];
    set('horario', { ...f.horario, 2: lun, 3: lun, 4: lun, 5: lun });
  }

  async function onFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setFoto(await comprimir(file));
    } catch {
      setError('No pudimos leer esa foto. Prueba con otra (JPG o PNG).');
    }
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      const r = await fetch('/api/equipo-ficha', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ficha: f, foto }) });
      const j = await r.json();
      if (!r.ok) return setError(j.error ?? 'No pudimos enviar tu ficha.');
      setOk(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('Sin conexión. Intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  if (ok)
    return (
      <div className="card mx-auto max-w-xl p-10 text-center">
        <img src="/img/char-plantando.svg" alt="" className="mx-auto w-48" />
        <h2 className="mt-6 font-display text-3xl font-bold text-marino-900">¡Gracias, {f.nombre.split(' ')[0]}!</h2>
        <p className="mt-3 text-tinta/70">Recibimos tu ficha. Te avisaremos cuando tu perfil esté publicado en la web.</p>
      </div>
    );

  const horasMarcadas = Object.values(f.horario).reduce((s, h) => s + h.length, 0);

  return (
    <form onSubmit={enviar} className="space-y-6">
      {/* 1 · IDENTIDAD */}
      <Seccion n={1} titulo="¿Quién eres?">
        <div className="grid gap-6 sm:grid-cols-[180px_1fr]">
          <div>
            <p className="label">Foto</p>
            <button type="button" onClick={() => fileRef.current?.click()}
              className="relative grid aspect-square w-full place-items-center overflow-hidden rounded-[2rem] border-2 border-dashed border-marino/20 bg-white text-marino transition hover:border-turquesa">
              {foto ? <img src={foto} alt="Tu foto" className="h-full w-full object-cover" /> : <span className="flex flex-col items-center gap-2 p-4 text-center text-sm"><Camera className="h-7 w-7" />Subir foto</span>}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFoto} />
            <p className="mt-2 text-xs text-tinta/55">De frente, con luz natural, fondo sencillo. Se recorta en cuadrado.</p>
          </div>
          <div className="grid gap-5">
            <div><label className="label" htmlFor="nombre">Nombre completo *</label><input id="nombre" required className="input" value={f.nombre} onChange={(e) => set('nombre', e.target.value)} /></div>
            <div><label className="label" htmlFor="nombreWeb">¿Cómo quieres aparecer en la web?</label><input id="nombreWeb" className="input" placeholder="Ej.: Micaela Núñez T." value={f.nombreWeb} onChange={(e) => set('nombreWeb', e.target.value)} /></div>
            <div><label className="label" htmlFor="titulo">Título profesional *</label><input id="titulo" required className="input" placeholder="Ej.: Psicóloga clínica" value={f.titulo} onChange={(e) => set('titulo', e.target.value)} /></div>
          </div>
        </div>
      </Seccion>

      {/* 2 · FORMACIÓN */}
      <Seccion n={2} titulo="Formación y registro" ayuda="Da confianza a los pacientes saber que estás registrado/a.">
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label className="label" htmlFor="senescyt">N.º de registro SENESCYT</label><input id="senescyt" className="input" value={f.senescyt} onChange={(e) => set('senescyt', e.target.value)} /></div>
          <div><label className="label" htmlFor="exp">Años de experiencia clínica</label><input id="exp" type="number" min={0} max={60} className="input" value={f.experiencia} onChange={(e) => set('experiencia', e.target.value)} /></div>
        </div>
        <label className="flex items-center gap-3 text-sm text-tinta/75"><input type="checkbox" checked={f.mostrarSenescyt} onChange={(e) => set('mostrarSenescyt', e.target.checked)} className="h-4 w-4 accent-turquesa" />Mostrar mi registro SENESCYT en la web</label>
        <div><label className="label" htmlFor="formacion">Formación (universidad, maestrías, especializaciones)</label><textarea id="formacion" rows={3} className="input resize-none" placeholder="Ej.: Psicología Clínica, PUCE · Maestría en Psicoterapia, UDLA" value={f.formacion} onChange={(e) => set('formacion', e.target.value)} /></div>
      </Seccion>

      {/* 3 · ENFOQUE */}
      <Seccion n={3} titulo="Tu enfoque">
        <div>
          <label className="label" htmlFor="corriente">Corriente principal *</label>
          <select id="corriente" required className="input" value={f.corriente} onChange={(e) => set('corriente', e.target.value)}>
            <option value="">Elige una…</option>
            {corrientes.map((c) => <option key={c.slug} value={c.slug}>{c.nombre}</option>)}
            <option value="otra">Otra</option>
          </select>
        </div>
        {f.corriente === 'otra' && <div><label className="label" htmlFor="otra">¿Cuál?</label><input id="otra" className="input" value={f.corrienteOtra} onChange={(e) => set('corrienteOtra', e.target.value)} /></div>}
        <div>
          <p className="label">Corrientes o herramientas complementarias</p>
          <Chips opciones={corrientes.filter((c) => c.slug !== f.corriente).map((c) => ({ id: c.slug, label: c.nombre }))} valor={f.complementarias} onChange={(v) => set('complementarias', v)} />
        </div>
        <div><label className="label" htmlFor="frase">Una frase que te represente (máx. 120 caracteres)</label><input id="frase" maxLength={120} className="input" placeholder="Ej.: Lo que te pasa también vive en tus vínculos." value={f.frase} onChange={(e) => set('frase', e.target.value)} /></div>
        <div>
          <label className="label" htmlFor="bio">Cuéntale a un paciente cómo trabajas (máx. 600 caracteres)</label>
          <textarea id="bio" rows={4} maxLength={600} className="input resize-none" placeholder="En lenguaje sencillo, sin tecnicismos. ¿Qué puede esperar de una sesión contigo?" value={f.bio} onChange={(e) => set('bio', e.target.value)} />
          <p className="mt-1 text-right text-xs text-tinta/50">{f.bio.length}/600</p>
        </div>
      </Seccion>

      {/* 4 · TEMAS */}
      <Seccion n={4} titulo="¿Con quién y en qué temas trabajas?">
        <div><p className="label">Población</p><Chips opciones={POBLACIONES_FICHA.map((x) => ({ id: x, label: x }))} valor={f.poblaciones} onChange={(v) => set('poblaciones', v)} /></div>
        <div><p className="label">Temas (elige tus 4–6 principales)</p><Chips opciones={TEMAS_FICHA.map((x) => ({ id: x, label: x }))} valor={f.temas} onChange={(v) => set('temas', v)} /></div>
        <div><label className="label" htmlFor="otros">Otros temas</label><input id="otros" className="input" value={f.temasOtros} onChange={(e) => set('temasOtros', e.target.value)} /></div>
        <div><label className="label" htmlFor="idiomas">Idiomas en los que atiendes</label><input id="idiomas" className="input" value={f.idiomas} onChange={(e) => set('idiomas', e.target.value)} /></div>
      </Seccion>

      {/* 5 · HORARIO */}
      <Seccion n={5} titulo="Modalidad y horario" ayuda="Marca las horas en las que puedes INICIAR una sesión de 50 minutos. Estas horas serán las que los pacientes puedan reservar.">
        <div><p className="label">Modalidades *</p><Chips opciones={Object.entries(modalidades).map(([id, label]) => ({ id, label }))} valor={f.modalidades} onChange={(v) => set('modalidades', v)} /></div>
        <div className="-mx-2 overflow-x-auto px-2">
          <table className="w-full min-w-[520px] border-separate border-spacing-1 text-center text-sm">
            <thead>
              <tr><th className="w-16" />{DIAS_FICHA.map((d) => <th key={d.n} className="font-display font-bold text-marino-900">{d.corto}</th>)}</tr>
            </thead>
            <tbody>
              {HORAS_FICHA.map((h) => (
                <tr key={h}>
                  <td className="pr-2 text-right font-display text-xs font-bold text-tinta/55">{h}</td>
                  {DIAS_FICHA.map((d) => {
                    const on = (f.horario[d.n] ?? []).includes(h);
                    return (
                      <td key={d.n}>
                        <button type="button" onClick={() => toggleHora(d.n, h)} aria-pressed={on} aria-label={`${d.corto} ${h}`}
                          className={`h-8 w-full rounded-lg transition ${on ? 'bg-turquesa' : 'bg-marino/5 hover:bg-turquesa/30'}`} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <button type="button" onClick={copiarLunes} className="btn-ghost !px-4 !py-2 text-sm"><Copy className="h-4 w-4" /> Copiar el lunes a mar–vie</button>
          <span className="text-tinta/60">{horasMarcadas} horas marcadas por semana</span>
        </div>
      </Seccion>

      {/* 6 · CONTACTO */}
      <Seccion n={6} titulo="Contacto interno" ayuda="Esto NO se publica. Es para que la administración te avise de tus turnos.">
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label className="label" htmlFor="email">Correo *</label><input id="email" type="email" required className="input" value={f.email} onChange={(e) => set('email', e.target.value)} /></div>
          <div><label className="label" htmlFor="wa">WhatsApp</label><input id="wa" type="tel" className="input" placeholder="09X XXX XXXX" value={f.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} /></div>
        </div>
        <div><label className="label" htmlFor="redes">LinkedIn o redes profesionales (opcional)</label><input id="redes" className="input" value={f.redes} onChange={(e) => set('redes', e.target.value)} /></div>
        <div><label className="label" htmlFor="com">¿Algo más que debamos saber?</label><textarea id="com" rows={3} className="input resize-none" placeholder="Vacaciones próximas, límite de pacientes, tarifas especiales…" value={f.comentarios} onChange={(e) => set('comentarios', e.target.value)} /></div>
        <label className="flex items-start gap-3 text-sm text-tinta/75">
          <input type="checkbox" required checked={f.consentimiento} onChange={(e) => set('consentimiento', e.target.checked)} className="mt-1 h-4 w-4 accent-turquesa" />
          Autorizo a RAÍZ Psicología Clínica a publicar en su sitio web mi foto, nombre, formación, enfoque, temas y horarios, con el fin de que los pacientes puedan conocerme y agendar conmigo. *
        </label>
      </Seccion>

      {error && <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={enviando} className="btn-turquesa w-full !py-4 text-base">
        {enviando ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />} Enviar mi ficha
      </button>
    </form>
  );
}
