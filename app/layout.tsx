import type { Metadata, Viewport } from 'next';
import '@fontsource/comfortaa/400.css';
import '@fontsource/comfortaa/600.css';
import '@fontsource/comfortaa/700.css';
import '@fontsource-variable/nunito-sans';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppFab } from '@/components/WhatsAppFab';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · ${site.claim}`, template: `%s · RAÍZ Psicología` },
  description: site.description,
  openGraph: { title: `${site.name} · ${site.claim}`, description: site.description, images: ['/img/hero.webp'], locale: 'es_EC', type: 'website' },
};

export const viewport: Viewport = { themeColor: '#2E7092' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
