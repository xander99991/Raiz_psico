'use client';
import { useEffect, useState } from 'react';
import { Copy, Download, Loader2, Trash2, Check } from 'lucide-react';
import { getCorriente } from '@/lib/corrientes';
import { modalidades, type Modalidad } from '@/lib/equipo';
import { DIAS_FICHA, type Ficha } from '@/lib/ficha';

type Fila = { id: string; data: Ficha; photo: string | null; createdAt: string };

export function FichasAdmin() {
  const [fichas, setFichas] = useState<Fila[] | null>(null);
  const [copiado, setCopiado] = useState('');

  async function cargar() {
    const r = await fetch('/api/admin/fichas', { cache: 'no-store' });
    setFichas(r.ok ? (await r.json()).fichas : []);
  }
  useEffect(() => { cargar(); }, []);

  async function borrar(id: string) {
    if (!window.confirm('¿Eliminar esta ficha?')) return;
    await fetch(`/api/admin/fichas?id=${id}`, { method: 'DELETE' });
    cargar();
  }
  async function copiar(f: Fila) {
    await navigator.clipboard.writeText(JSON.stringify(f.data, null, 2));
    setCopiado(f.id);
    setTimeout(() => setCopiado(''), 2000);
  }
  function descargar(f: Fila) {
    if (!f.photo) return;
    const a = document.createElement('a');
    a.href = f.photo;
    a.download = `${f.data.nombre.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-')}.webp`;
    a.click();
  }

  if (!fichas) return <div className="grid place-items-center py-16"><Loader2 className="h-6 w-6 animate-spin text-turquesa" /></div>;

  return (
    <div className="mt-6 space-y-5">
      <div className="card p-5 text-sm text-tinta/75">
        Comparte con tu equipo el enlace <strong className="text-marino-900">www.raizpsicologia.org/unete</strong>. Sus fichas aparecen aquí.
        Para publicarlas, usa <em>Copiar ficha</em> y <em>Descargar foto</em> y envíaselas a quien mantiene la web.
      </div>
      {fichas.length === 0 && <p className="card p-8 text-center text-tinta/60">Todavía no llegan fichas.</p>}
      {fichas.map((f) => {
        const d = f.data;
        const c = d.corriente === 'otra' ? d.corrienteOtra : getCorriente(d.corriente)?.nombre;
        return (
          <article key={f.id} className="card grid gap-6 p-6 md:grid-cols-[140px_1fr]">
            <div>
              {f.photo ? <img src={f.photo} alt={d.nombre} className="aspect-square w-full rounded-3xl object-cover" /> : <div className="grid aspect-square w-full place-items-center rounded-3xl bg-marino/5 text-sm text-tinta/50">Sin foto</div>}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-bold text-marino-900">{d.nombreWeb || d.nombre}</h3>
                  <p className="text-sm text-tinta/60">{d.titulo}{d.senescyt ? ` · SENESCYT ${d.senescyt}` : ''}{d.experiencia ? ` · ${d.experiencia} años` : ''}</p>
                </div>
                <p className="text-xs text-tinta/45">Enviada el {new Date(f.createdAt).toLocaleDateString('es-EC')}</p>
              </div>
              <p className="mt-3 inline-block rounded-full bg-turquesa-100 px-3 py-1 text-xs font-bold text-turquesa-600">{c}</p>
              {d.frase && <p className="mt-3 font-display italic text-marino">“{d.frase}”</p>}
              {d.bio && <p className="mt-2 text-sm leading-relaxed text-tinta/75">{d.bio}</p>}
              <p className="mt-3 text-sm text-tinta/70"><strong>Temas:</strong> {[...d.temas, d.temasOtros].filter(Boolean).join(', ') || '—'}</p>
              <p className="text-sm text-tinta/70"><strong>Población:</strong> {d.poblaciones.join(', ') || '—'} · <strong>Idiomas:</strong> {d.idiomas}</p>
              <p className="text-sm text-tinta/70"><strong>Modalidad:</strong> {d.modalidades.map((m) => modalidades[m as Modalidad] ?? m).join(' · ')}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {DIAS_FICHA.filter((x) => d.horario[x.n]?.length).map((x) => (
                  <span key={x.n} className="rounded-xl bg-agua-100 px-3 py-1.5 text-marino-900"><strong>{x.corto}</strong> {d.horario[x.n].join(', ')}</span>
                ))}
              </div>
              <p className="mt-3 text-sm text-tinta/70"><strong>Contacto:</strong> {d.email}{d.whatsapp ? ` · ${d.whatsapp}` : ''}</p>
              {d.formacion && <p className="text-sm text-tinta/70"><strong>Formación:</strong> {d.formacion}</p>}
              {d.comentarios && <p className="text-sm italic text-tinta/60">Nota: {d.comentarios}</p>}
              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={() => copiar(f)} className="btn-ghost !px-4 !py-2 text-sm">{copiado === f.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copiado === f.id ? 'Copiada' : 'Copiar ficha'}</button>
                {f.photo && <button onClick={() => descargar(f)} className="btn-ghost !px-4 !py-2 text-sm"><Download className="h-4 w-4" /> Descargar foto</button>}
                <button onClick={() => borrar(f.id)} className="btn !px-4 !py-2 text-sm text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Eliminar</button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
