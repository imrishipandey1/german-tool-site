import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontakt – ZappTool',
  description: 'Kontaktieren Sie uns bei Fragen oder Anmerkungen zu ZappTool.',
  robots: 'noindex, follow'
};

export default function Kontakt() {
  return (
    <div className="wrap" style={{ paddingBottom: '72px' }}>
      <section className="c nar">
        <h1 style={{ marginBottom: "24px" }}>Kontakt</h1>
        <p>Haben Sie Fragen, Feedback oder benötigen Sie Hilfe mit einem unserer Werkzeuge?</p>
        <p>Da ZappTool ohne Uploads arbeitet und alle Dateien direkt in Ihrem Browser verarbeitet werden, können wir Ihre Bilder oder PDFs nicht einsehen. Sollten Sie jedoch technische Probleme haben oder uns Feedback geben wollen, freuen wir uns über Ihre Nachricht.</p>
        
        <div style={{ marginTop: '32px', padding: '24px', backgroundColor: '#fff', border: '1px solid var(--line)', borderRadius: '16px' }}>
          <h2 style={{ marginTop: '0', marginBottom: '16px', fontSize: '1.25rem' }}>Schreiben Sie uns eine E-Mail</h2>
          <p style={{ marginBottom: '0' }}>
            Sie erreichen uns jederzeit unter:<br />
            <a href="mailto:contact@zapptool.de" style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.125rem', textDecoration: 'underline', display: 'inline-block', marginTop: '8px' }}>
              contact@zapptool.de
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
