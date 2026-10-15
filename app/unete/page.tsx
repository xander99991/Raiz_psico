import type { Metadata } from 'next';
import { FichaEquipo } from '@/components/FichaEquipo';

export const metadata: Metadata = { title: 'Ficha del equipo', robots: { index: false, follow: false } };

export default function UnetePage() {
  return (
    <div className="pb-24 pt-32">
      <div className="container-raiz max-w-3xl">
        <span className="eyebrow">Solo para el equipo</span>
        <h1 className="h-display mt-5 text-4xl leading-tight sm:text-5xl">Tu ficha para la web de RAÍZ</h1>
        <p className="mt-4 text-lg text-tinta/75">
          Con esta información armamos tu perfil en la sección <strong>Equipo</strong> y tus horarios en la <strong>Agenda</strong>. Toma unos 10 minutos.
          Usa un lenguaje cercano: quien lo lea puede estar pasando un momento difícil.
        </p>
        <div className="mt-10"><FichaEquipo /></div>
      </div>
    </div>
  );
}
