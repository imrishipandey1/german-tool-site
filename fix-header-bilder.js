const fs = require('fs');
let header = fs.readFileSync('src/components/Header.tsx', 'utf8');

const oldBilderBlock = `<div className={\`dd \${openDD === 'bilder' ? 'show' : ''}\`} id="dd-bilder">
                  <Link className="t" href="/bilder-komprimieren">Bilder komprimieren<small>JPG, PNG und WebP verkleinern</small></Link>
                  <Link className="t" href="/bild-konvertieren">Bild konvertieren<small>Zwischen JPG, PNG und WebP wechseln</small></Link>
                  <Link className="t" href="/heic-in-jpg">HEIC in JPG<small>iPhone-Fotos umwandeln</small></Link>
                  <Link className="t" href="/bildgroesse-aendern">Bildgröße ändern<small>Breite und Höhe anpassen</small></Link>
                  <Link className="t" href="/bild-zuschneiden">Bild zuschneiden<small>Ausschnitt frei wählen</small></Link>
                  <Link className="t" href="/bild-drehen">Bild drehen<small>Drehen und spiegeln</small></Link>
                  <Link className="all" href="/bilder">Alle Bild-Werkzeuge</Link>
                </div>`;

const newBilderBlock = `<div className={\`dd \${openDD === 'bilder' ? 'show' : ''}\`} id="dd-bilder">
                  {liveTools.map(t => (
                    <Link key={t.slug} className="t" href={'/' + t.slug}>{t.name}<small>Kostenlos & schnell</small></Link>
                  ))}
                </div>`;

header = header.replace(oldBilderBlock, newBilderBlock);

fs.writeFileSync('src/components/Header.tsx', header);
