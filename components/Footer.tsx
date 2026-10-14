'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Mail, MessageCircle, MapPin, Phone } from 'lucide-react';
import { nav, site } from '@/lib/site';

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return (
    <footer className="relative overflow-hidden bg-marino-900 text-hueso">
      <div className="pattern-iso absolute inset-0" aria-hidden />
      <div className="container-raiz relative grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Image src="/img/logo-white.svg" alt="RAÍZ Psicología Clínica" width={170} height={112} className="h-auto w-[150px]" />
          <p className="mt-6 max-w-sm text-hueso/80">
            Acompañamos procesos de bienestar emocional desde una mirada humana, consciente y contextual.
          </p>
          <p className="mt-6 font-display text-lg font-bold text-agua">En tu raíz.</p>
        </div>
        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-widest text-celeste">Explora</h2>
          <ul className="mt-4 space-y-2">
            {[...nav, { href: '/agenda', label: 'Agendar turno' }].map((n) => (
              <li key={n.href}><Link href={n.href} className="text-hueso/85 hover:text-white">{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-widest text-celeste">Contacto</h2>
          <ul className="mt-4 space-y-3 text-hueso/85">
            <li className="flex items-start gap-3"><MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-agua" /><a href={`https://wa.me/${site.whatsapp}`} className="hover:text-white">{site.phoneDisplay}</a></li>
            <li className="flex items-start gap-3"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-agua" /><a href={`mailto:${site.email}`} className="break-all hover:text-white">{site.email}</a></li>
            <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-agua" />{site.cities}</li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container-raiz flex flex-col gap-4 py-6 text-sm text-hueso/70 md:flex-row md:items-center md:justify-between">
          <p className="flex items-start gap-2">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-agua" />
            <span>
              Si estás en crisis o en peligro, no esperes un turno: llama al <strong className="text-white">911</strong> o a la línea de salud mental del MSP{' '}
              <strong className="text-white">171, opción 6</strong> (todos los días, 07:00–20:00).
            </span>
          </p>
          <p className="shrink-0">© {new Date().getFullYear()} RAÍZ Psicología Clínica</p>
        </div>
      </div>
    </footer>
  );
}
