import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/psicologia', '/equipo', '/tarifa', '/agenda', '/rincon'].map((p) => ({ url: `${site.url}${p}`, lastModified: new Date() }));
}
