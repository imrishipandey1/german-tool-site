import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ImageConverter from '@/components/tools/ImageConverter';

export async function generateMetadata() {
  const tool = await getToolBySlug('png-in-jpg');
  if (!tool) return {};
  return {
    title: tool.frontmatter.title,
    description: tool.frontmatter.description,
  };
}

export default async function PngInJpgPage() {
  const tool = await getToolBySlug('png-in-jpg');
  
  if (!tool) {
    return <div className="wrap"><p>Tool nicht gefunden.</p></div>;
  }

  return (
    <div className="wrap" style={{ paddingBottom: '72px' }}>
      <nav className="crumbs" aria-label="Brotkrumen">
        <ol>
          <li><Link href="/">Startseite</Link></li>
          <li><Link href="/bilder">Bilder</Link></li>
          <li aria-current="page">PNG in JPG</li>
        </ol>
      </nav>

      <header className="th">
        <h1>{tool.frontmatter.h1}</h1>
        <p>{tool.frontmatter.subtitle}</p>
      </header>

      <ImageConverter />

      <p className="priv">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
        Ihre Bilder werden nicht hochgeladen. Die Umwandlung läuft auf Ihrem Gerät.
      </p>

      <div className="ad" aria-label="Anzeige">Anzeige (Platzhalter mit fester Höhe)</div>

      <div 
        className="tool-content" 
        dangerouslySetInnerHTML={{ __html: tool.contentHtml }} 
      />
    </div>
  );
}
