"use client";
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth'
    });
  };

  const handleCookieSettings = () => {
    document.dispatchEvent(new CustomEvent('open-cookie-settings'));
  };

  return (
    <>
      <section className="trust" aria-label="Unsere Datenschutz-Versprechen">
        <ul>
          <li>
            <span className="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></span>
            <div><strong>Dateien bleiben bei Ihnen</strong><span>Die Verarbeitung läuft direkt in Ihrem Browser. Es wird nichts hochgeladen.</span></div>
          </li>
          <li>
            <span className="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg></span>
            <div><strong>Server in Frankfurt am Main</strong><span>Gehostet in Deutschland, innerhalb der EU.</span></div>
          </li>
          <li>
            <span className="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 5 6v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg></span>
            <div><strong>Datenschutz von Anfang an</strong><span>Entwickelt nach den Grundsätzen der DSGVO, ohne Nutzerkonto.</span></div>
          </li>
          <li>
            <span className="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M5 20h14"/></svg></span>
            <div><strong>Kostenlos und ohne Anmeldung</strong><span>Keine Registrierung, keine Wasserzeichen, keine versteckten Kosten.</span></div>
          </li>
        </ul>
      </section>

      <footer className="footer">
        <div className="ft-main">
          <div className="brand">
            <Link className="logo" href="/" aria-label="DateiWerk – zur Startseite">
              <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
                <rect width="36" height="36" rx="10" fill="#1D4ED8"/>
                <path d="M11 8h10l6 6v14a1 1 0 0 1-1 1H11a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" fill="#fff"/>
                <path d="M21 8v6h6" fill="#BFDBFE"/>
                <path d="M18.5 16.5v7m-3-3 3 3 3-3" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Datei<b>Werk</b></span>
            </Link>
            <p>Kostenlose Werkzeuge für Bilder und PDFs. Schnell, sicher und direkt im Browser.</p>
            <div className="loc">
              <span className="flag" aria-hidden="true"><i></i><i></i><i></i></span>
              <span>Server-Standort: Frankfurt am Main<small>Deutschland · Europäische Union</small></span>
            </div>
          </div>

          <nav className="col" aria-label="Bilder-Werkzeuge">
            <h2>Bilder</h2>
            <ul>
              <li><Link href="/bilder-komprimieren">Bilder komprimieren</Link></li>
              <li><Link href="/bild-konvertieren">Bild konvertieren</Link></li>
              <li><Link href="/heic-in-jpg">HEIC in JPG</Link></li>
              <li><Link href="/bildgroesse-aendern">Bildgröße ändern</Link></li>
              <li><Link href="/bild-zuschneiden">Bild zuschneiden</Link></li>
            </ul>
          </nav>
          <nav className="col" aria-label="PDF-Werkzeuge">
            <h2>PDF</h2>
            <ul>
              <li><Link href="/pdf-komprimieren">PDF komprimieren</Link></li>
              <li><Link href="/pdf-zusammenfuegen">PDF zusammenfügen</Link></li>
              <li><Link href="/pdf-teilen">PDF teilen</Link></li>
              <li><Link href="/pdf-in-jpg">PDF in JPG</Link></li>
              <li><Link href="/jpg-in-pdf">JPG in PDF</Link></li>
            </ul>
          </nav>
          <nav className="col" aria-label="Weitere Werkzeuge">
            <h2>Sonstiges</h2>
            <ul>
              <li><Link href="/qr-code-erstellen">QR-Code erstellen</Link></li>
              <li><Link href="/passfoto-groesse">Passfoto zuschneiden</Link></li>
              <li><Link href="/base64-konverter">Base64-Konverter</Link></li>
              <li><Link href="/alle-werkzeuge">Alle Werkzeuge</Link></li>
            </ul>
          </nav>
          <nav className="col" aria-label="Rechtliches">
            <h2>Rechtliches</h2>
            <ul>
              <li><Link href="/impressum">Impressum</Link></li>
              <li><Link href="/datenschutz">Datenschutzerklärung</Link></li>
              <li><Link href="/nutzungsbedingungen">Nutzungsbedingungen</Link></li>
              <li><button type="button" onClick={handleCookieSettings}>Cookie-Einstellungen</button></li>
              <li><Link href="/kontakt">Kontakt</Link></li>
            </ul>
          </nav>
        </div>

        <div className="ft-bottom">
          <div>
            <span>© <span>{currentYear}</span> DateiWerk. Alle Rechte vorbehalten.</span>
            <span className="r">
              <span className="ok"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>Keine Dateien auf unseren Servern</span>
              <button className="top" type="button" onClick={handleScrollTop}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>Nach oben
              </button>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
