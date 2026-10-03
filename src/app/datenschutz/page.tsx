import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung – ZappTool',
  description: 'Datenschutzerklärung von ZappTool.',
  robots: 'noindex, follow'
};

export default function Datenschutz() {
  return (
    <div className="wrap" style={{ paddingBottom: '72px' }}>
      <section className="c nar">
        <h1 style={{ marginBottom: "8px" }}>Datenschutzerklärung</h1>
        <p style={{ color: "var(--muted)", marginBottom: "40px" }}>Stand: Oktober 2026</p>

        <h2>1. Verantwortlicher</h2>
        <p>Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website ist:</p>
        <p>
          Zapp Tool<br />
          Max Mustermann<br />
          12-24, 85716 Unterschleißheim-Lohhof<br />
          Deutschland
        </p>
        <p>E-Mail: contact@zapptool.de</p>

        <h2>2. Allgemeine Hinweise zur Datenverarbeitung</h2>
        <p>Der Schutz Ihrer personenbezogenen Daten ist uns wichtig.</p>
        <p>Zapp Tool bietet kostenlose Online-Tools zur Verarbeitung und Konvertierung von Bildern und PDF-Dateien an.</p>
        <p>Ein wesentlicher Bestandteil unseres Angebots ist die lokale Verarbeitung Ihrer Dateien. Die von Ihnen ausgewählten Bilder und PDF-Dateien werden grundsätzlich nicht auf unsere Server hochgeladen. Die Verarbeitung erfolgt direkt in Ihrem Webbrowser auf Ihrem Endgerät.</p>
        <p>Wir haben keinen Zugriff auf die von Ihnen zur Verarbeitung ausgewählten Dateien und speichern diese nicht auf unseren Servern.</p>
        <p>Bei der Nutzung unserer Website können jedoch technisch erforderliche Daten verarbeitet werden, die bei der Kommunikation zwischen Ihrem Endgerät und unserer Website anfallen. Einzelheiten hierzu finden Sie in den folgenden Abschnitten.</p>

        <h2>3. Aufruf unserer Website</h2>
        <p>Beim Aufruf von zapptool.de wird eine Verbindung zwischen Ihrem Endgerät und unserer Website hergestellt.</p>
        <p>Dabei können technisch erforderliche Informationen verarbeitet werden. Dazu können insbesondere gehören:</p>
        <ul>
          <li>IP-Adresse</li>
          <li>Datum und Uhrzeit des Zugriffs</li>
          <li>aufgerufene Internetadresse (URL)</li>
          <li>übertragene Datenmenge</li>
          <li>verwendeter Browser</li>
          <li>Betriebssystem</li>
          <li>Referrer-URL</li>
          <li>technische Informationen zur Verbindung</li>
        </ul>
        <p>Diese Informationen werden verarbeitet, um die Website technisch bereitzustellen, die Sicherheit und Stabilität des Angebots zu gewährleisten und Missbrauch sowie Angriffe auf unsere Infrastruktur zu erkennen und abzuwehren.</p>
        <p>Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der sicheren, stabilen und funktionsfähigen Bereitstellung unserer Website.</p>

        <h2>4. Hosting</h2>
        <p>Unsere Website wird auf einem Server der Oracle Cloud Infrastructure (OCI) betrieben. Der von uns genutzte Server befindet sich in Frankfurt am Main, Deutschland.</p>
        <p>Für den Betrieb der Website können technisch erforderliche Verbindungs- und Zugriffsdaten verarbeitet werden.</p>
        <p>Die Verarbeitung erfolgt zur technischen Bereitstellung, Sicherheit und Stabilität der Website.</p>
        <p>Oracle stellt Informationen zu Datenschutz und DSGVO für seine Cloud-Dienste bereit. (Oracle)</p>
        <p>Soweit für die Nutzung von Oracle Cloud eine Auftragsverarbeitungsvereinbarung erforderlich ist, erfolgt die Verarbeitung auf Grundlage der entsprechenden vertraglichen Datenschutzvereinbarungen.</p>

        <h2>5. Nutzung von Cloudflare</h2>
        <p>Wir verwenden Dienste der Cloudflare, Inc., um unsere Website unter anderem über ein Content Delivery Network (CDN) bereitzustellen sowie vor bestimmten Angriffen und missbräuchlichen Zugriffen zu schützen.</p>
        <p>Dabei wird der Datenverkehr zwischen Ihrem Endgerät und unserer Website über das Netzwerk von Cloudflare geleitet.</p>
        <p>Cloudflare kann hierbei technische Verbindungs- und Verkehrsdaten verarbeiten. Dazu können insbesondere IP-Adressen, Zeitstempel, angeforderte URLs und Informationen über Netzwerk- und Sicherheitsereignisse gehören.</p>
        <p>Cloudflare beschreibt diese Daten als Traffic Metadata bzw. Customer Logs. Nach eigenen Angaben verarbeitet Cloudflare solche Metadaten zur Bereitstellung, Sicherheit und Zuverlässigkeit seiner Netzwerkdienste. (Cloudflare)</p>
        <p>Die Verarbeitung erfolgt zur sicheren und zuverlässigen Bereitstellung unserer Website und auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.</p>
        <p>Weitere Informationen zum Datenschutz bei Cloudflare finden Sie in der Datenschutzerklärung von Cloudflare:</p>
        <p>Cloudflare Datenschutzerklärung</p>
        <p>Cloudflare bietet außerdem Informationen zur DSGVO-Verarbeitung seiner Dienste an. (Cloudflare)</p>

        <h2>6. Verarbeitung von Bildern und PDF-Dateien</h2>
        <p><b>Lokale Verarbeitung im Browser</b></p>
        <p>Die von Ihnen ausgewählten Bilder und PDF-Dateien werden bei der Nutzung unserer Online-Tools nicht auf unsere Server hochgeladen.</p>
        <p>Die Verarbeitung erfolgt direkt auf Ihrem Endgerät innerhalb Ihres Browsers.</p>
        <p>Dies betrifft beispielsweise die Konvertierung von:</p>
        <ul>
          <li>JPG in WebP</li>
          <li>Bildern in PDF</li>
          <li>PDF in Bilder</li>
          <li>sowie weitere von Zapp Tool angebotene Bild- und PDF-Verarbeitungen.</li>
        </ul>
        <p>Die ausgewählten Dateien verlassen für die eigentliche Verarbeitung grundsätzlich nicht Ihr Endgerät.</p>
        <p>Wir erhalten und speichern insbesondere keine von Ihnen ausgewählten Bild- oder PDF-Dateien.</p>
        <p>Auch die erzeugten Dateien werden grundsätzlich direkt in Ihrem Browser erstellt und können anschließend auf Ihrem Endgerät gespeichert werden.</p>
        <p><b>Keine Speicherung der verarbeiteten Dateien</b></p>
        <p>Zapp Tool speichert die von Ihnen ausgewählten Dateien oder die daraus erzeugten Dateien nicht auf unseren Servern.</p>
        <p>Nach Abschluss der Verarbeitung verbleiben die Dateien auf Ihrem Endgerät, soweit Sie diese dort speichern.</p>

        <h2>7. Cookies und ähnliche Technologien</h2>
        <p>Zapp Tool verwendet derzeit keine Cookies zu Analyse-, Werbe- oder Marketingzwecken.</p>
        <p>Wir verwenden derzeit auch keine:</p>
        <ul>
          <li>Tracking-Pixel</li>
          <li>Analyse-Tools</li>
          <li>Marketing-Tracker</li>
          <li>Social-Media-Tracker</li>
          <li>personalisierten Werbesysteme</li>
        </ul>
        <p>Es werden von Zapp Tool keine Cookies eingesetzt, um Nutzerprofile für Werbe- oder Analysezwecke zu erstellen.</p>
        <p>Die Nutzung unserer Bild- und PDF-Tools erfordert keine Speicherung persönlicher Einstellungen auf Ihrem Endgerät.</p>
        <p>Sollten wir künftig Dienste einsetzen, die eine Einwilligung für Cookies oder vergleichbare Technologien erfordern, werden wir unsere Datenschutzhinweise entsprechend anpassen und – soweit erforderlich – vor der entsprechenden Verarbeitung eine Einwilligung einholen.</p>

        <h2>8. Google Search Console</h2>
        <p>Wir verwenden die Google Search Console zur technischen Überwachung und Analyse der Auffindbarkeit unserer Website in der Google-Suche.</p>
        <p>Die Google Search Console dient uns insbesondere dazu, technische Probleme der Website zu erkennen und Informationen über die Darstellung unserer Website in den Google-Suchergebnissen zu erhalten.</p>
        <p>Wir verwenden auf unserer Website kein Google Analytics.</p>
        <p>Die Google Search Console wird nicht eingesetzt, um auf unserer Website Nutzerprofile zu erstellen oder personalisierte Werbung anzuzeigen.</p>

        <h2>9. Keine personalisierte Werbung</h2>
        <p>Zapp Tool wird derzeit kostenlos und ohne Werbung betrieben.</p>
        <p>Wir verwenden derzeit keine personalisierten Werbedienste und keine Werbetracking-Technologien.</p>
        <p>Sollten künftig Werbedienste, beispielsweise Google AdSense, eingesetzt werden, wird diese Datenschutzerklärung vor deren Einsatz entsprechend aktualisiert.</p>

        <h2>10. Kontaktaufnahme per E-Mail</h2>
        <p>Wenn Sie uns per E-Mail unter contact@zapptool.de kontaktieren, werden die von Ihnen übermittelten personenbezogenen Daten verarbeitet, soweit dies zur Bearbeitung Ihrer Anfrage erforderlich ist.</p>
        <p>Hierzu können insbesondere gehören:</p>
        <ul>
          <li>Ihre E-Mail-Adresse</li>
          <li>Ihr Name, sofern Sie diesen angeben</li>
          <li>der Inhalt Ihrer Nachricht</li>
          <li>weitere Informationen, die Sie freiwillig in Ihrer Nachricht übermitteln</li>
        </ul>
        <p>Die Verarbeitung erfolgt zur Bearbeitung und Beantwortung Ihrer Anfrage und auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Soweit Ihre Anfrage auf den Abschluss oder die Durchführung eines Vertrags gerichtet ist, kann zusätzlich Art. 6 Abs. 1 lit. b DSGVO als Rechtsgrundlage dienen.</p>
        <p>Die Daten werden nicht für Werbezwecke verwendet.</p>

        <h2>11. Weitergabe personenbezogener Daten</h2>
        <p>Eine Weitergabe personenbezogener Daten an Dritte erfolgt grundsätzlich nicht, sofern dies nicht für den technischen Betrieb unserer Website erforderlich ist oder eine gesetzliche Verpflichtung besteht.</p>
        <p>Im Rahmen des technischen Betriebs können insbesondere unsere Hosting- und CDN-Dienstleister personenbezogene bzw. technisch erforderliche Daten verarbeiten.</p>
        <p>Wir verkaufen personenbezogene Daten nicht und verwenden sie nicht für personalisierte Werbung.</p>

        <h2>12. Datenübermittlung in Drittländer</h2>
        <p>Durch die Nutzung von Cloudflare können technische Daten unter Umständen auch außerhalb der Europäischen Union bzw. des Europäischen Wirtschaftsraums verarbeitet werden.</p>
        <p>Cloudflare weist darauf hin, dass seine globalen Netzwerkdienste Datenverkehr über verschiedene Standorte weltweit verarbeiten können und dass bestimmte Verkehrsdaten in Rechenzentren in den USA und Europa verarbeitet werden können. (Cloudflare)</p>
        <p>Soweit eine Übermittlung personenbezogener Daten in ein Drittland erfolgt, werden die hierfür nach der DSGVO erforderlichen geeigneten Garantien bzw. Rechtsgrundlagen berücksichtigt.</p>

        <h2>13. Dauer der Speicherung</h2>
        <p>Wir speichern personenbezogene Daten nur so lange, wie dies für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.</p>
        <p>Die von Ihnen zur Verarbeitung ausgewählten Bilder und PDF-Dateien werden von Zapp Tool nicht auf unseren Servern gespeichert.</p>
        <p>Technisch erforderliche Verbindungs- und Sicherheitsdaten können durch unsere Hosting- und CDN-Infrastruktur verarbeitet und für einen begrenzten Zeitraum gespeichert werden. Die konkrete Speicherdauer kann dabei von den jeweiligen technischen Dienstleistern und deren Konfiguration abhängen.</p>

        <h2>14. Ihre Rechte als betroffene Person</h2>
        <p>Sie haben nach Maßgabe der gesetzlichen Voraussetzungen insbesondere folgende Rechte:</p>
        <ul>
          <li>Recht auf Auskunft gemäß Art. 15 DSGVO</li>
          <li>Recht auf Berichtigung gemäß Art. 16 DSGVO</li>
          <li>Recht auf Löschung gemäß Art. 17 DSGVO</li>
          <li>Recht auf Einschränkung der Verarbeitung gemäß Art. 18 DSGVO</li>
          <li>Recht auf Datenübertragbarkeit gemäß Art. 20 DSGVO</li>
          <li>Recht auf Widerspruch gemäß Art. 21 DSGVO</li>
        </ul>
        <p>Wenn eine Verarbeitung auf Ihrer Einwilligung beruht, können Sie diese Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen.</p>
        <p>Durch den Widerruf wird die Rechtmäßigkeit der aufgrund der Einwilligung bis zum Widerruf erfolgten Verarbeitung nicht berührt.</p>

        <h2>15. Widerspruch gegen die Verarbeitung</h2>
        <p>Soweit wir Ihre personenbezogenen Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO verarbeiten, haben Sie das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit Widerspruch gegen diese Verarbeitung einzulegen.</p>
        <p>Zur Ausübung Ihrer Rechte können Sie uns per E-Mail kontaktieren:</p>
        <p>contact@zapptool.de</p>

        <h2>16. Beschwerderecht bei einer Aufsichtsbehörde</h2>
        <p>Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.</p>
        <p>Die zuständige Aufsichtsbehörde richtet sich grundsätzlich nach Ihrem Wohn- bzw. Aufenthaltsort oder dem Ort des mutmaßlichen Verstoßes.</p>
        <p>Eine Übersicht der deutschen Datenschutzaufsichtsbehörden finden Sie beim Bundesbeauftragten für den Datenschutz und die Informationsfreiheit (BfDI).</p>
        <p>Bundesbeauftragter für den Datenschutz und die Informationsfreiheit</p>

        <h2>17. Datensicherheit</h2>
        <p>Wir setzen technische und organisatorische Maßnahmen ein, um unsere Website und die dabei verarbeiteten Daten gegen Verlust, Manipulation, unberechtigten Zugriff und andere Sicherheitsrisiken zu schützen.</p>
        <p>Die Übertragung zwischen Ihrem Browser und unserer Website erfolgt grundsätzlich verschlüsselt über HTTPS.</p>
        <p>Da die Verarbeitung der von Ihnen ausgewählten Dateien direkt auf Ihrem Endgerät erfolgt, werden diese Dateien für die eigentliche Verarbeitung nicht an unsere Server übertragen.</p>

        <h2>18. Aktualisierung dieser Datenschutzerklärung</h2>
        <p>Wir behalten uns vor, diese Datenschutzerklärung anzupassen, wenn sich unsere Website, die von uns eingesetzten technischen Dienste oder die gesetzlichen Anforderungen ändern.</p>
        <p>Es gilt jeweils die auf dieser Website veröffentlichte aktuelle Fassung dieser Datenschutzerklärung.</p>
      </section>
    </div>
  );
}
