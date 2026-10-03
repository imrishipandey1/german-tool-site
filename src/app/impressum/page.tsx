import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum – ZappTool',
  description: 'Impressum und rechtliche Angaben für ZappTool.',
  robots: 'noindex, follow'
};

export default function Impressum() {
  return (
    <div className="wrap" style={{ paddingBottom: '72px' }}>
      <section className="c nar">
        <h1 style={{ marginBottom: "24px" }}>Impressum</h1>
        
        <h2>Angaben gemäß § 5 DDG</h2>
        <p>
          Zapp Tool<br />
          Max Mustermann<br />
          12-24, 85716 Unterschleißheim-Lohhof<br />
          Deutschland
        </p>

        <h2>Kontakt</h2>
        <p>E-Mail: contact@zapptool.de</p>

        <h2>Verantwortlich für den Inhalt</h2>
        <p>Max Mustermann</p>

        <h2>Angaben zum Angebot</h2>
        <p>Zapp Tool bietet kostenlose Online-Tools zur Verarbeitung und Konvertierung von Bildern und PDF-Dateien an.</p>
        <p>Die Verarbeitung der von Nutzern ausgewählten Dateien erfolgt grundsätzlich direkt im Browser des Nutzers. Die Dateien werden nicht auf die Server von Zapp Tool hochgeladen oder dort gespeichert.</p>

        <h2>Verbraucherstreitbeilegung</h2>
        <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>

        <h2>Hinweis zur Kontaktaufnahme</h2>
        <p>Für Anfragen, Hinweise oder sonstige Anliegen können Sie uns per E-Mail unter contact@zapptool.de erreichen.</p>
      </section>
    </div>
  );
}
