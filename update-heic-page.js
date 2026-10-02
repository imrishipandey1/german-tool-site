const fs = require('fs');

let page = fs.readFileSync('src/app/heic-in-jpg/page.tsx', 'utf8');

// The new list item
const newListItem = `                <li>
                  <span className="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg></span>
                  <div><b>JPG oder JPEG wählen</b><span>Laden Sie Ihre konvertierten Bilder wahlweise als JPG oder JPEG herunter – beide Formate sind technisch identisch.</span></div>
                </li>`;

// We inject it right after the Mehrere Fotos auf einmal
const target = `                  <div><b>Mehrere Fotos auf einmal</b><span>Wählen Sie ganze Serien aus und laden Sie jedes Ergebnis einzeln.</span></div>
                </li>`;

page = page.replace(target, target + '\n' + newListItem);

fs.writeFileSync('src/app/heic-in-jpg/page.tsx', page);
