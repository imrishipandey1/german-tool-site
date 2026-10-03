import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import JpgConverter from '@/components/tools/JpgConverter';

export async function generateMetadata() {
  const tool = await getToolBySlug('jpg-in-png');
  if (!tool) return {};
  return {
    title: tool.frontmatter.title,
    description: tool.frontmatter.description,
  };
}

export default async function JpgInPngPage() {
  const tool = await getToolBySlug('jpg-in-png');
  
  if (!tool) {
    return <div className="wrap"><p>Tool nicht gefunden.</p></div>;
  }

  return (
    <div className="jpg-png-page" style={{ paddingBottom: '74px' }}>
      <header className="hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Brotkrumen">
            <ol>
              <li><Link href="/">Startseite</Link></li>
              <li aria-current="page">JPG in PNG</li>
            </ol>
          </nav>
          
          <div className="hero-content">
            <h1>{tool.frontmatter.h1}</h1>
            <p className="lead">{tool.frontmatter.subtitle}</p>
            
            <ul className="hero-points">
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>
                Kostenlos
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 7v5l3 2"/></svg>
                Direkt im Browser
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                Mehrere Dateien
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>
                PNG herunterladen
              </li>
            </ul>
          </div>
        </div>
      </header>

      <div className="wrap tool-shell">
        <JpgConverter />
      </div>

      <div className="wrap">
        <div 
          className="tool-content" 
          dangerouslySetInnerHTML={{ __html: tool.contentHtml }} 
        />
      </div>
    </div>
  );
}
/* Force rebuild */
/* Force rebuild 2 */
