const fs = require('fs');

let md = fs.readFileSync('src/content/tools/webp-in-jpg.md', 'utf8');

const additionalSections = `
  <h2 style="margin-top: clamp(32px, 5vw, 48px);">Mehr Kontrolle bei der Konvertierung</h2>
  <div class="uses" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
    <div class="use">
      <i><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg></i>
      <h3>JPG-Qualität</h3>
      <p>Passen Sie die JPG-Qualität an, um Bildqualität und Dateigröße selbst zu bestimmen.</p>
    </div>
    <div class="use">
      <i><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg></i>
      <h3>Hintergrund bei Transparenz</h3>
      <p>Legen Sie die Hintergrundfarbe für transparente Bereiche fest, die JPG nicht darstellen kann.</p>
    </div>
    <div class="use">
      <i><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg></i>
      <h3>Größe anpassen</h3>
      <p>Wählen Sie die gewünschte maximale Bildbreite oder behalten Sie die Originalgröße bei. Das Seitenverhältnis bleibt erhalten und kleinere Bilder werden nicht vergrößert.</p>
    </div>
    <div class="use">
      <i><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg></i>
      <h3>Dateiname</h3>
      <p>Legen Sie fest, wie die konvertierten Dateien benannt werden sollen.</p>
    </div>
  </div>

  <h2 style="margin-top: clamp(32px, 5vw, 48px);">Weitere Optionen</h2>
  <div class="uses">
    <div class="use">
      <i><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg></i>
      <h3>Metadaten entfernen</h3>
      <p>Entfernen Sie Kamera-, Standort- und andere EXIF-Daten aus den konvertierten Bildern.</p>
    </div>
    <div class="use">
      <i><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg></i>
      <h3>Progressives JPG</h3>
      <p>Ermöglichen Sie, dass sich JPG-Bilder auf Webseiten schrittweise aufbauen.</p>
    </div>
    <div class="use">
      <i><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg></i>
      <h3>Animierte WebP-Dateien</h3>
      <p>Bei animierten WebP-Dateien wird nur das erste Bild in JPG übernommen.</p>
    </div>
  </div>`;

// Insert it directly after the first .uses div
const insertionPoint = `</p></div>\n  </div>`;
const replacement = insertionPoint + '\n' + additionalSections;

md = md.replace(insertionPoint, replacement);

fs.writeFileSync('src/content/tools/webp-in-jpg.md', md);
