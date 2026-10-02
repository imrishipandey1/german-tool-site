const fs = require('fs');
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');

const newRechtliches = `          <nav className="col" aria-label="Rechtliches">
            <h2>Rechtliches</h2>
            <ul>
              <li><a href="https://german-tool-site.vercel.app/impressum">Impressum</a></li>
              <li><a href="https://german-tool-site.vercel.app/datenschutz">Datenschutzerklärung</a></li>
              <li><a href="https://german-tool-site.vercel.app/nutzungsbedingungen">Nutzungsbedingungen</a></li>
              <li><button type="button" onClick={handleCookieSettings}>Cookie-Einstellungen</button></li>
              <li><a href="https://german-tool-site.vercel.app/kontakt">Kontakt</a></li>
            </ul>
          </nav>
        </div>`;

footer = footer.replace('        </div>', newRechtliches);
fs.writeFileSync('src/components/Footer.tsx', footer);
