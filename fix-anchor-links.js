const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

page = page.replace(/<Link className="btn p" href="#werkzeuge">Werkzeuge ansehen<\/Link>/, '<a className="btn p" href="#werkzeuge">Werkzeuge ansehen</a>');
page = page.replace(/<Link className="btn s" href="#datenschutz">So schützen wir Ihre Daten<\/Link>/, '<a className="btn s" href="#datenschutz">So schützen wir Ihre Daten</a>');
page = page.replace(/<Link className="btn p" href="#werkzeuge">Zur Übersicht<\/Link>/, '<a className="btn p" href="#werkzeuge">Zur Übersicht</a>');

fs.writeFileSync('src/app/page.tsx', page);
