const fs = require('fs');

let md = fs.readFileSync('src/content/tools/jpg-in-png.md', 'utf8');

const newSection = `
<section class="content">
  <h2>Funktionen für Ihre JPG-Dateien</h2>
  <div class="info-grid">
    <article class="info-card">
      <div class="icon"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22a10 10 0 1 1 10-10c0 5-5 10-10 10z"/><circle cx="7.5" cy="9.5" r="1.5"/><circle cx="10.5" cy="5.5" r="1.5"/><circle cx="15.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="11.5" r="1.5"/></svg></div>
      <h3>PNG-Version</h3>
      <p>Wählen Sie zwischen <strong>PNG</strong> für vollständige Farbdarstellung und <strong>PNG-8</strong> für kleinere Dateien bei Bildern mit wenigen Farben.</p>
    </article>
    <article class="info-card">
      <div class="icon"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg></div>
      <h3>Hintergrund</h3>
      <p>Legen Sie fest, ob der PNG-Hintergrund <strong>weiß oder transparent</strong> ausgegeben werden soll.</p>
    </article>
    <article class="info-card">
      <div class="icon"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg></div>
      <h3>Größe anpassen</h3>
      <p>Behalten Sie die Originalgröße bei oder wählen Sie eine maximale Breite. Das Seitenverhältnis bleibt erhalten und kleinere Bilder werden nicht vergrößert.</p>
    </article>
    <article class="info-card">
      <div class="icon"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg></div>
      <h3>Dateiname</h3>
      <p>Bestimmen Sie die Namensregel für die konvertierten Dateien.</p>
    </article>
    <article class="info-card">
      <div class="icon"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg></div>
      <h3>Metadaten entfernen</h3>
      <p>Entfernen Sie eingebettete Kamera-, Standort- und andere Metadaten aus den konvertierten Bildern.</p>
    </article>
    <article class="info-card">
      <div class="icon"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg></div>
      <h3>Interlaced PNG</h3>
      <p>Aktivieren Sie den schrittweisen Bildaufbau beim Laden auf Webseiten.</p>
    </article>
  </div>
</section>
`;

// Insert the new section before the FAQ section
const targetStr = '<section class="content narrow">\n  <h2>Häufige Fragen zur JPG-zu-PNG-Konvertierung</h2>';
md = md.replace(targetStr, newSection + '\n' + targetStr);

fs.writeFileSync('src/content/tools/jpg-in-png.md', md);
