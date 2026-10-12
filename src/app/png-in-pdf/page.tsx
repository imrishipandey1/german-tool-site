import PngToPdfConverter from '@/components/tools/PngToPdfConverter';
import { getToolBySlug } from '@/lib/tools';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata() {
  const tool = await getToolBySlug('png-in-pdf');
  if (!tool) return {};
  return {
    title: tool.frontmatter.title,
    description: tool.frontmatter.description,
  };
}

export default async function PngInPdfPage() {
  const tool = await getToolBySlug('png-in-pdf');
  if (!tool) notFound();

  return (
    <div className="png-pdf-page">
      <div className="wrap">
        <nav className="crumbs" aria-label="Brotkrumen">
          <ol>
            <li><Link href="/">Startseite</Link></li>
            <li aria-current="page">PNG in PDF</li>
          </ol>
        </nav>

        <header className="head">
          <span className="fm" aria-hidden="true">
            <b>PNG</b>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14m-5-5 5 5-5 5"/>
            </svg>
            <b className="o">PDF</b>
          </span>
          <h1>{tool.frontmatter.h1}</h1>
          <p>{tool.frontmatter.subtitle}</p>
        </header>

        <PngToPdfConverter />

        <div 
          className="tool-content" 
          dangerouslySetInnerHTML={{ __html: tool.contentHtml }} 
        />
      </div>
    </div>
  );
}
