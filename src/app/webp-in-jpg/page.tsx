import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import WebpConverter from '@/components/tools/WebpConverter';

export async function generateMetadata() {
  const tool = await getToolBySlug('webp-in-jpg');
  if (!tool) return {};
  return {
    title: tool.frontmatter.title,
    description: tool.frontmatter.description,
  };
}

export default async function WebpInJpgPage() {
  const tool = await getToolBySlug('webp-in-jpg');
  
  if (!tool) {
    return <div className="wrap"><p>Tool nicht gefunden.</p></div>;
  }

  return (
    <div className="webp-page" style={{ paddingBottom: '72px' }}>
      <div className="hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Brotkrumen">
            <ol>
              <li><Link href="/">Startseite</Link></li>
              <li><Link href="/bilder">Bilder</Link></li>
              <li aria-current="page">WebP in JPG</li>
            </ol>
          </nav>
          <h1>{tool.frontmatter.h1}</h1>
          <p className="lead">{tool.frontmatter.subtitle}</p>
          <ul className="pills">
            <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>Kostenlos</li>
            <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>Kein Upload</li>
            <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>Stapelverarbeitung</li>
            <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>ZIP-Download</li>
          </ul>
        </div>
      </div>

      <div className="wrap">
        <WebpConverter />

        <div 
          className="tool-content" 
          dangerouslySetInnerHTML={{ __html: tool.contentHtml }} 
        />
      </div>
    </div>
  );
}
