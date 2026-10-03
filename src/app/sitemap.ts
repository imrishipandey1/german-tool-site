import { MetadataRoute } from 'next';
import { liveTools } from '@/lib/config/tools';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://zapptool.de';

  const toolsSitemap = liveTools.map((tool) => ({
    url: `${baseUrl}/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const staticPages = [
    '',
    '/impressum',
    '/datenschutz',
    '/nutzungsbedingungen',
    '/kontakt'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
    priority: route === '' ? 1.0 : 0.5,
  }));

  return [...staticPages, ...toolsSitemap];
}
