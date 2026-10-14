'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, CalendarHeart } from 'lucide-react';
import { nav } from '@/lib/site';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overHero = pathname === '/' && !scrolled && !open;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  if (pathname.startsWith('/admin')) return null;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        overHero ? 'bg-transparent py-5' : 'bg-hueso/85 py-3 shadow-[0_10px_30px_-20px_rgba(28,74,99,.4)] backdrop-blur-lg'
      }`}
    >
      <div className="container-raiz flex items-center justify-between gap-4">
        <Link href="/" aria-label="RAÍZ Psicología Clínica — inicio" className="shrink-0">
          <Image
            src={overHero ? '/img/logo-white.svg' : '/img/logo.svg'}
            alt="RAÍZ Psicología Clínica"
            width={150}
            height={100}
            priority
            className={`h-auto transition-all duration-500 ${overHero ? 'w-[120px] sm:w-[140px]' : 'w-[92px] sm:w-[104px]'}`}
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-full px-4 py-2 font-display text-sm font-bold transition ${
                overHero ? 'text-hueso hover:bg-white/15' : 'text-marino-900 hover:bg-agua-100'
              } ${pathname === n.href ? (overHero ? 'bg-white/15' : 'bg-agua-100') : ''}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/agenda" className={`${overHero ? 'btn-light' : 'btn-turquesa'} !px-5 !py-2.5`}>
            <CalendarHeart className="h-4 w-4" aria-hidden /> <span className="hidden sm:inline">Agendar turno</span>
            <span className="sm:hidden">Agendar</span>
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className={`grid h-11 w-11 place-items-center rounded-full lg:hidden ${overHero ? 'text-hueso' : 'text-marino-900'}`}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="container-raiz mt-3 grid gap-1 pb-4 lg:hidden" aria-label="Móvil">
          {[{ href: '/', label: 'Inicio' }, ...nav, { href: '/agenda', label: 'Agendar turno' }].map((n) => (
            <Link key={n.href} href={n.href} className="rounded-2xl px-4 py-3 font-display text-lg font-bold text-marino-900 hover:bg-agua-100">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
