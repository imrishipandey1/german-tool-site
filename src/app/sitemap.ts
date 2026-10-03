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
    ''
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }));

  return [...staticPages, ...toolsSitemap];
}
