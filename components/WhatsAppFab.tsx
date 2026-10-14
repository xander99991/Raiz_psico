'use client';
import { usePathname } from 'next/navigation';
import { site } from '@/lib/site';

export function WhatsAppFab() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return (
    <a
      href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Hola RAÍZ 🌱, quisiera información sobre una cita.')}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,.7)] transition hover:scale-105"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden>
        <path d="M16.04 3C9.4 3 4 8.36 4 14.97c0 2.11.56 4.17 1.62 5.99L4 29l8.25-1.6a12.1 12.1 0 0 0 3.79.6C22.68 28 28 22.64 28 16.03 28 9.41 22.68 3 16.04 3zm0 22.9c-1.2 0-2.38-.2-3.5-.6l-.25-.1-4.9.95.96-4.73-.16-.25a9.8 9.8 0 0 1-1.52-5.2c0-5.44 4.42-9.87 9.86-9.87 5.43 0 9.84 4.43 9.84 9.93 0 5.44-4.41 9.87-9.84 9.87zm5.4-7.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.57-.48-.5-.67-.5h-.57c-.2 0-.52.08-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.09 3.18 5.06 4.46.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.12-.27-.2-.57-.35z" />
      </svg>
    </a>
  );
}
