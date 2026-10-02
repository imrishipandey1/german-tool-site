const fs = require('fs');
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');

const newImport = `import Link from 'next/link';\nimport { liveTools } from '@/lib/config/tools';`;
footer = footer.replace(`import Link from 'next/link';`, newImport);

const footerBilderToReplace = `          <nav className="col" aria-label="Bilder-Werkzeuge">
            <h2>Bilder</h2>
            <ul>
              <li><Link href="/bilder-komprimieren">Bilder komprimieren</Link></li>
              <li><Link href="/bild-konvertieren">Bild konvertieren</Link></li>
              <li><Link href="/heic-in-jpg">HEIC in JPG</Link></li>
              <li><Link href="/bildgroesse-aendern">Bildgröße ändern</Link></li>
              <li><Link href="/bild-zuschneiden">Bild zuschneiden</Link></li>
            </ul>
          </nav>`;

const newFooterBilder = `          <nav className="col" aria-label="Bilder-Werkzeuge">
            <h2>Bilder</h2>
            <ul>
              {liveTools.map(t => (
                <li key={t.slug}><Link href={'/' + t.slug}>{t.name}</Link></li>
              ))}
            </ul>
          </nav>`;
footer = footer.replace(footerBilderToReplace, newFooterBilder);

const pdfToRemove = `          <nav className="col" aria-label="PDF-Werkzeuge">
            <h2>PDF</h2>
            <ul>
              <li><Link href="/pdf-komprimieren">PDF komprimieren</Link></li>
              <li><Link href="/pdf-zusammenfuegen">PDF zusammenfügen</Link></li>
              <li><Link href="/pdf-teilen">PDF teilen</Link></li>
              <li><Link href="/pdf-in-jpg">PDF in JPG</Link></li>
              <li><Link href="/jpg-in-pdf">JPG in PDF</Link></li>
            </ul>
          </nav>`;
footer = footer.replace(pdfToRemove, '');

const sonstigesToRemove = `          <nav className="col" aria-label="Weitere Werkzeuge">
            <h2>Sonstiges</h2>
            <ul>
              <li><Link href="/qr-code-erstellen">QR-Code erstellen</Link></li>
              <li><Link href="/passfoto-groesse">Passfoto zuschneiden</Link></li>
              <li><Link href="/base64-konverter">Base64-Konverter</Link></li>
              <li><Link href="/alle-werkzeuge">Alle Werkzeuge</Link></li>
            </ul>
          </nav>`;
footer = footer.replace(sonstigesToRemove, '');

const rechtlichesToRemove = `          <nav className="col" aria-label="Rechtliches">
            <h2>Rechtliches</h2>
            <ul>
              <li><Link href="/impressum">Impressum</Link></li>
              <li><Link href="/datenschutz">Datenschutzerklärung</Link></li>
              <li><Link href="/nutzungsbedingungen">Nutzungsbedingungen</Link></li>
              <li><button type="button" onClick={handleCookieSettings}>Cookie-Einstellungen</button></li>
              <li><Link href="/kontakt">Kontakt</Link></li>
            </ul>
          </nav>`;
footer = footer.replace(rechtlichesToRemove, '');

fs.writeFileSync('src/components/Footer.tsx', footer);
