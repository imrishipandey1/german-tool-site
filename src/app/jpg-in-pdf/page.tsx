import JpgToPdfConverter from '@/components/tools/JpgToPdfConverter';
import { getToolBySlug } from '@/lib/tools';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata() {
  const tool = await getToolBySlug('jpg-in-pdf');
  if (!tool) return {};
  return {
    title: tool.frontmatter.title,
    description: tool.frontmatter.description,
  };
}

export default async function JpgInPdfPage() {
  const tool = await getToolBySlug('jpg-in-pdf');
  if (!tool) notFound();

  return (
    <div className="jpg-pdf-page">
      <div className="band">
        <div className="wrap">
          <div>
            <nav className="crumbs" aria-label="Brotkrumen"><ol><li><Link href="/">Startseite</Link></li><li aria-current="page">JPG in PDF</li></ol></nav>
            <h1>{tool.frontmatter.h1}</h1>
            <p className="lead">{tool.frontmatter.subtitle}</p>
          </div>
          <svg className="ill" width="300" height="190" viewBox="0 0 300 190" aria-hidden="true">
            <g transform="rotate(-8 70 100)"><rect x="18" y="52" width="96" height="76" rx="10" fill="#fff" stroke="#BFDBFE" strokeWidth="2"/><path d="m30 116 22-26 16 16 12-12 22 22" fill="none" stroke="#93C5FD" strokeWidth="3" strokeLinejoin="round"/><circle cx="46" cy="72" r="6" fill="#93C5FD"/></g>
            <g transform="rotate(5 90 100)"><rect x="44" y="44" width="96" height="76" rx="10" fill="#fff" stroke="#93C5FD" strokeWidth="2"/><path d="m56 108 22-26 16 16 12-12 22 22" fill="none" stroke="#60A5FA" strokeWidth="3" strokeLinejoin="round"/><circle cx="72" cy="64" r="6" fill="#60A5FA"/></g>
            <path d="M156 96h40m-12-12 12 12-12 12" fill="none" stroke="#1D4ED8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <g><rect x="208" y="28" width="72" height="104" rx="8" fill="#fff" stroke="#1D4ED8" strokeWidth="2.5"/><rect x="208" y="28" width="72" height="26" rx="8" fill="#1D4ED8"/><text x="244" y="46" fontFamily="Arial,sans-serif" fontSize="14" fontWeight="700" fill="#fff" textAnchor="middle">PDF</text><path d="M220 72h48M220 86h48M220 100h32" stroke="#BFDBFE" strokeWidth="4" strokeLinecap="round"/></g>
          </svg>
        </div>
      </div>

      <div className="wrap">
        <JpgToPdfConverter />
        
        <div 
          className="tool-content" 
          dangerouslySetInnerHTML={{ __html: tool.contentHtml }} 
        />
      </div>
    </div>
  );
}
