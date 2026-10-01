import HeicConverter from '@/components/tools/HeicConverter';
import { getToolBySlug } from '@/lib/tools';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata() {
  const tool = await getToolBySlug('heic-in-jpg');
  if (!tool) return {};
  return {
    title: tool.frontmatter.title,
    description: tool.frontmatter.description,
  };
}

export default async function HeicInJpgPage() {
  const tool = await getToolBySlug('heic-in-jpg');
  if (!tool) notFound();

  return (
    <div style={{ paddingBottom: '72px' }}>
      <div className="stage">
        <div className="wrap">
          <nav className="crumbs" aria-label="Brotkrumen">
            <ol>
              <li><Link href="/">Startseite</Link></li>
              <li><a href="/bilder">Bilder</a></li>
              <li aria-current="page">HEIC in JPG</li>
            </ol>
          </nav>

          <div className="split">
            <div className="intro">
              <span className="eyebrow"><i></i>iPhone-Fotos · HEIC und HEIF</span>
              <h1>{tool.frontmatter.h1}</h1>
              <p className="lead">{tool.frontmatter.subtitle}</p>
              <ul className="facts">
                <li>
                  <span className="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></span>
                  <div><b>Fotos bleiben auf Ihrem Gerät</b><span>Die Umwandlung läuft lokal, nichts wird hochgeladen.</span></div>
                </li>
                <li>
                  <span className="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg></span>
                  <div><b>Standortdaten entfernen</b><span>Auf Wunsch werden GPS-Angaben aus den Fotos gelöscht.</span></div>
                </li>
                <li>
                  <span className="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="7" width="14" height="12" rx="2"/><path d="M7 3h14v12"/></svg></span>
                  <div><b>Mehrere Fotos auf einmal</b><span>Wählen Sie ganze Serien aus und laden Sie jedes Ergebnis einzeln.</span></div>
                </li>
              </ul>
            </div>

            <HeicConverter />
          </div>
        </div>
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
