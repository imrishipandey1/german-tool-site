import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="wrap">
          <div>
            <p className="status"><i></i>Werkzeuge werden gerade vorbereitet</p>
            <h1>Bilder und PDFs bearbeiten, ohne Upload</h1>
            <p className="lead">Kostenlose Werkzeuge, die direkt in Ihrem Browser laufen. Ihre Dateien verlassen dabei nie Ihr Gerät.</p>
            <div className="cta-row">
              <Link className="btn p" href="#werkzeuge">Werkzeuge ansehen</Link>
              <Link className="btn s" href="#datenschutz">So schützen wir Ihre Daten</Link>
            </div>
            <ul>
              <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>Kostenlos</li>
              <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>Ohne Anmeldung</li>
              <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>Server in Frankfurt</li>
            </ul>
          </div>

          <div className="demo" role="img" aria-label="Beispiel: Ein Foto wird von 2,4 MB auf 480 KB verkleinert">
            <div className="file">
              <span className="ft"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8" fill="currentColor"/><path d="m4 18 5-5 3 3 3-3 5 5"/></svg></span>
              <div><b>urlaub.jpg</b><small>Original</small></div>
              <span className="sz tn">2,4 MB</span>
            </div>
            <div className="arrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14m-5-5 5 5 5-5"/></svg>Im Browser komprimiert <span className="save tn">−80 %</span></div>
            <div className="file after">
              <span className="ft" style={{ background: 'var(--success)' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg></span>
              <div><b>urlaub-klein.jpg</b><small>Fertig zum Download</small></div>
              <span className="sz tn">480 KB</span>
            </div>
            <p className="cap">Beispiel zur Veranschaulichung</p>
          </div>
        </div>
      </section>

      {/* Werkzeuge */}
      <section id="werkzeuge">
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
      </section>

      {/* Datenschutz / So funktioniert es */}
      <section className="how" id="datenschutz">
        <div className="wrap">
          <h2>So funktioniert es, und warum Ihre Dateien sicher bleiben</h2>
          <ol className="steps">
            <li><div><h3>Datei auswählen</h3><p>Ziehen Sie eine Datei in das Feld oder wählen Sie sie auf Ihrem Gerät aus.</p></div></li>
            <li><div><h3>Im Browser bearbeiten</h3><p>Die Verarbeitung passiert auf Ihrem Gerät. Es wird nichts an einen Server gesendet.</p></div></li>
            <li><div><h3>Ergebnis herunterladen</h3><p>Sie sehen sofort die neue Dateigröße und laden das Ergebnis mit einem Klick herunter.</p></div></li>
          </ol>
          <div className="check">
            <h3>Sie können es selbst überprüfen</h3>
            <p>Öffnen Sie in Ihrem Browser die Entwicklertools (meist mit F12) und wählen Sie den Reiter „Netzwerk“. Während Sie eine Datei bearbeiten, sehen Sie dort keine Datenübertragung Ihrer Datei.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="wrap">
          <h2>Häufige Fragen</h2>
          <div className="faq">
            <details><summary>Sind die Werkzeuge wirklich kostenlos?</summary><p>Ja. Sie können alle Werkzeuge ohne Anmeldung und ohne Wasserzeichen nutzen. Die Seite finanziert sich durch Werbung.</p></details>
            <details><summary>Werden meine Dateien hochgeladen?</summary><p>Nein. Ihre Dateien werden direkt in Ihrem Browser verarbeitet und verlassen Ihr Gerät nicht.</p></details>
            <details><summary>Brauche ich ein Konto?</summary><p>Nein. Sie müssen sich nicht registrieren und keine E-Mail-Adresse angeben.</p></details>
            <details><summary>Gibt es eine Begrenzung der Dateigröße?</summary><p>Da alles auf Ihrem Gerät läuft, hängt die mögliche Dateigröße vom Arbeitsspeicher Ihres Geräts ab. Sehr große Dateien können auf älteren Handys langsamer sein.</p></details>
            <details><summary>Wo stehen Ihre Server?</summary><p>Die Website wird auf einem Server in Frankfurt am Main (Deutschland) gehostet.</p></details>
            <details><summary>Wann sind die Werkzeuge verfügbar?</summary><p>Wir schalten die Werkzeuge nacheinander frei. Den aktuellen Stand sehen Sie in der Übersicht oben.</p></details>
          </div>
        </div>
      </section>

      {/* Abschluss */}
      <section className="end">
        <div className="wrap">
          <div className="box">
            <h2>Bereit, wenn Sie es sind</h2>
            <p>Schauen Sie bald wieder vorbei. Die ersten Werkzeuge für Bilder und PDFs kommen als Nächstes.</p>
            <Link className="btn p" href="#werkzeuge">Zur Übersicht</Link>
          </div>
        </div>
      </section>
    </>
  );
}
