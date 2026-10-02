const fs = require('fs');

let header = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Replace the hardcoded TOOLS array
const newToolsImport = `import { liveTools } from '@/lib/config/tools';

const TOOLS = liveTools.map(t => ({ t: t.name, h: '/' + t.slug, g: t.category === 'bilder' ? 'Bilder' : t.category }));`;

header = header.replace(/const TOOLS = \[[^]*?\];/, newToolsImport);

// Remove PDF and Sonstiges dropdowns
// The HTML structure has <div className="m_group"> blocks
const htmlToReplace = `                <div className="m_group">
                  <div className="m_label">PDF</div>
                  <ul>
                    <li><Link href="/pdf-komprimieren">PDF komprimieren</Link></li>
                    <li><Link href="/pdf-zusammenfuegen">PDF zusammenfügen</Link></li>
                    <li><Link href="/pdf-teilen">PDF teilen</Link></li>
                    <li><Link href="/pdf-in-jpg">PDF in JPG</Link></li>
                    <li><Link href="/jpg-in-pdf">JPG in PDF</Link></li>
                    <li><Link href="/pdf-drehen">PDF drehen</Link></li>
                  </ul>
                  <div className="m_more"><Link href="/pdf">Alle PDF-Werkzeuge<svg width="14" height="14"><use href="#s-arrow"/></svg></Link></div>
                </div>
                
                <div className="m_group">
                  <div className="m_label">Sonstiges</div>
                  <ul>
                    <li><Link href="/qr-code-erstellen">QR-Code erstellen</Link></li>
                    <li><Link href="/passfoto-groesse">Passfoto zuschneiden</Link></li>
                    <li><Link href="/base64-konverter">Base64-Konverter</Link></li>
                    <li><Link href="/dateigroesse-rechner">Dateigröße-Rechner</Link></li>
                  </ul>
                  <div className="m_more"><Link href="/sonstiges">Alle sonstigen Werkzeuge<svg width="14" height="14"><use href="#s-arrow"/></svg></Link></div>
                </div>`;

header = header.replace(htmlToReplace, '');

// Fix the Bilder dropdown
const bilderHtmlToReplace = `                  <ul>
                    <li><Link href="/bilder-komprimieren">Bilder komprimieren</Link></li>
                    <li><Link href="/bild-konvertieren">Bild konvertieren</Link></li>
                    <li><Link href="/heic-in-jpg">HEIC in JPG</Link></li>
                    <li><Link href="/bildgroesse-aendern">Bildgröße ändern</Link></li>
                    <li><Link href="/bild-zuschneiden">Bild zuschneiden</Link></li>
                    <li><Link href="/bild-drehen">Bild drehen</Link></li>
                  </ul>
                  <div className="m_more"><Link href="/bilder">Alle Bilder-Werkzeuge<svg width="14" height="14"><use href="#s-arrow"/></svg></Link></div>`;

const newBilderHtml = `                  <ul>
                    {liveTools.map(t => (
                      <li key={t.slug}><Link href={'/' + t.slug}>{t.name}</Link></li>
                    ))}
                  </ul>`;

header = header.replace(bilderHtmlToReplace, newBilderHtml);

// Fix the other desktop menu dropdowns
const desktopPdfToReplace = `          <li className={openDD === 'pdf' ? 'on' : ''} onMouseEnter={() => handleMouseEnter('pdf')} onMouseLeave={handleMouseLeave}>
            <button type="button" aria-expanded={openDD === 'pdf'} onClick={(e) => { e.preventDefault(); toggleDD('pdf'); }}>PDF<svg width="14" height="14"><use href="#s-chevron"/></svg></button>
            <div className="dd">
              <ul className="d_grid">
                <li><Link href="/pdf-komprimieren"><strong>PDF komprimieren</strong><span>Dateigröße verkleinern</span></Link></li>
                <li><Link href="/pdf-zusammenfuegen"><strong>PDF zusammenfügen</strong><span>Mehrere PDFs verbinden</span></Link></li>
                <li><Link href="/pdf-teilen"><strong>PDF teilen</strong><span>Seiten extrahieren</span></Link></li>
                <li><Link href="/pdf-in-jpg"><strong>PDF in JPG</strong><span>Seiten als Bilder speichern</span></Link></li>
                <li><Link href="/jpg-in-pdf"><strong>JPG in PDF</strong><span>Bilder zu PDF machen</span></Link></li>
                <li><Link href="/pdf-drehen"><strong>PDF drehen</strong><span>Seiten rotieren</span></Link></li>
              </ul>
              <div className="d_more"><Link href="/pdf">Alle PDF-Werkzeuge<svg width="14" height="14"><use href="#s-arrow"/></svg></Link></div>
            </div>
          </li>`;
header = header.replace(desktopPdfToReplace, '');

const desktopSonstigesToReplace = `          <li className={openDD === 'other' ? 'on' : ''} onMouseEnter={() => handleMouseEnter('other')} onMouseLeave={handleMouseLeave}>
            <button type="button" aria-expanded={openDD === 'other'} onClick={(e) => { e.preventDefault(); toggleDD('other'); }}>Sonstiges<svg width="14" height="14"><use href="#s-chevron"/></svg></button>
            <div className="dd">
              <ul className="d_grid">
                <li><Link href="/qr-code-erstellen"><strong>QR-Code erstellen</strong><span>Links als Code teilen</span></Link></li>
                <li><Link href="/passfoto-groesse"><strong>Passfoto zuschneiden</strong><span>Für Ausweise anpassen</span></Link></li>
                <li><Link href="/base64-konverter"><strong>Base64-Konverter</strong><span>Daten kodieren</span></Link></li>
                <li><Link href="/dateigroesse-rechner"><strong>Dateigröße-Rechner</strong><span>Pixel in Megabyte</span></Link></li>
              </ul>
              <div className="d_more"><Link href="/sonstiges">Alle sonstigen Werkzeuge<svg width="14" height="14"><use href="#s-arrow"/></svg></Link></div>
            </div>
          </li>`;
header = header.replace(desktopSonstigesToReplace, '');

const desktopBilderToReplace = `              <ul className="d_grid">
                <li><Link href="/bilder-komprimieren"><strong>Bilder komprimieren</strong><span>Kleinere JPG, PNG & WebP</span></Link></li>
                <li><Link href="/bild-konvertieren"><strong>Bild konvertieren</strong><span>Zwischen Formaten wechseln</span></Link></li>
                <li><Link href="/heic-in-jpg"><strong>HEIC in JPG</strong><span>iPhone-Fotos umwandeln</span></Link></li>
                <li><Link href="/bildgroesse-aendern"><strong>Bildgröße ändern</strong><span>Auflösung anpassen</span></Link></li>
                <li><Link href="/bild-zuschneiden"><strong>Bild zuschneiden</strong><span>Zuschneiden & Formatieren</span></Link></li>
                <li><Link href="/bild-drehen"><strong>Bild drehen</strong><span>Fotos rotieren</span></Link></li>
              </ul>
              <div className="d_more"><Link href="/bilder">Alle Bilder-Werkzeuge<svg width="14" height="14"><use href="#s-arrow"/></svg></Link></div>`;
              
const newDesktopBilder = `              <ul className="d_grid">
                {liveTools.map(t => (
                  <li key={t.slug}><Link href={'/' + t.slug}><strong>{t.name}</strong><span>Kostenlos & schnell</span></Link></li>
                ))}
              </ul>`;
header = header.replace(desktopBilderToReplace, newDesktopBilder);

fs.writeFileSync('src/components/Header.tsx', header);
