const fs = require('fs');
let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Add import for liveTools
const newImport = `import Link from "next/link";\nimport { liveTools } from "@/lib/config/tools";`;
page = page.replace(`import Link from "next/link";`, newImport);

// 2. Remove the "Werkzeuge werden gerade vorbereitet" badge
page = page.replace(`<p className="status"><i></i>Werkzeuge werden gerade vorbereitet</p>`, '');

// 3. Rewrite the #werkzeuge section
const oldWerkzeuge = `<section id="werkzeuge">
        <div className="wrap">
          <h2>Alle Werkzeuge nach Kategorie</h2>
          <p className="lead">Wir starten mit den häufigsten Aufgaben für Bilder und PDFs. Sobald ein Werkzeug bereit ist, wird es hier freigeschaltet.</p>

          <div className="cats">
            <article className="cat">
              <header><span className="ic i-img"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8" fill="currentColor"/><path d="m4 18 5-5 3 3 3-3 5 5"/></svg></span><h3>Bilder</h3></header>
              <p>Verkleinern, umwandeln und zuschneiden.</p>
              <ul>
                <li data-status="live"><Link href="/png-in-jpg">PNG in JPG</Link><span className="tag live">Neu</span></li>
                <li data-status="live"><Link href="/heic-in-jpg">HEIC in JPG</Link><span className="tag live">Neu</span></li>
                <li data-status="live"><Link href="/webp-in-jpg">WebP in JPG</Link><span className="tag live">Neu</span></li>
                <li data-status="live"><Link href="/jpg-in-png">JPG in PNG</Link><span className="tag live">Neu</span></li>
              </ul>
            </article>
            <article className="cat">
              <header><span className="ic i-pdf"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v5h5M9 14h6M9 17.5h4"/></svg></span><h3>PDF</h3></header>
              <p>Zusammenfügen, teilen und verkleinern.</p>
              <ul>
                <li data-status="soon"><span>PDF komprimieren</span><span className="tag">Bald verfügbar</span></li>
                <li data-status="soon"><span>PDF zusammenfügen</span><span className="tag">Bald verfügbar</span></li>
                <li data-status="soon"><span>PDF teilen</span><span className="tag">Bald verfügbar</span></li>
                <li data-status="soon"><span>JPG in PDF</span><span className="tag">Bald verfügbar</span></li>
              </ul>
            </article>
            <article className="cat">
              <header><span className="ic i-misc"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM17 14v6M14 17h6"/></svg></span><h3>Sonstiges</h3></header>
              <p>Kleine Helfer für den Alltag.</p>
              <ul>
                <li data-status="soon"><span>QR-Code erstellen</span><span className="tag">Bald verfügbar</span></li>
                <li data-status="soon"><span>Passfoto zuschneiden</span><span className="tag">Bald verfügbar</span></li>
                <li data-status="soon"><span>Base64-Konverter</span><span className="tag">Bald verfügbar</span></li>
              </ul>
            </article>
          </div>
        </div>
      </section>`;

const newWerkzeuge = `<section id="werkzeuge">
        <div className="wrap">
          <h2>Bilder-Werkzeuge</h2>
          <p className="lead">Häufige Aufgaben für Bilder direkt im Browser erledigen.</p>

          <div className="cats" style={{ gridTemplateColumns: '1fr' }}>
            <article className="cat">
              <header><span className="ic i-img"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8" fill="currentColor"/><path d="m4 18 5-5 3 3 3-3 5 5"/></svg></span><h3>Bilder</h3></header>
              <p>Verkleinern, umwandeln und zuschneiden.</p>
              <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                {liveTools.map(t => (
                  <li data-status="live" key={t.slug}>
                    <Link href={'/' + t.slug}>{t.name}</Link>
                  </li>
                ))}
              </ul>
            </article>
          </div>
          <p style={{ marginTop: '24px', color: 'var(--muted)', textAlign: 'center' }}>Weitere Werkzeuge folgen in Kürze</p>
        </div>
      </section>`;

page = page.replace(oldWerkzeuge, newWerkzeuge);

// 4. Remove FAQ item about when tools arrive
const faqToRemove = `<details><summary>Wann sind die Werkzeuge verfügbar?</summary><p>Wir schalten die Werkzeuge nacheinander frei. Den aktuellen Stand sehen Sie in der Übersicht oben.</p></details>`;
page = page.replace(faqToRemove, '');

fs.writeFileSync('src/app/page.tsx', page);
