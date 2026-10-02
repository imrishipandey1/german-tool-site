const fs = require('fs');

let md = fs.readFileSync('src/content/tools/heic-in-jpg.md', 'utf8');

// 1. Subtitle
md = md.replace(
  'Der kostenlose HEIC to JPG Converter für Ihre iPhone-Fotos',
  'Der kostenlose HEIC-zu-JPG-Converter für Ihre iPhone-Fotos'
);

// 2. Platzsparender als JPG
md = md.replace(
  'Es speichert Bilder bei gleicher Qualität platzsparender als JPG.',
  'HEIC kann Bilder bei vergleichbarer Bildqualität platzsparender als JPG speichern.'
);

// 3. Akzeptiert von allen
md = md.replace(
  'Akzeptiert von allen Upload-Formularen',
  'Von vielen Upload-Formularen akzeptiert'
);

// 4. JPG funktioniert dagegen
md = md.replace(
  'JPG funktioniert dagegen fast überall.',
  'JPG wird von den meisten Geräten, Programmen und Websites unterstützt.'
);

// 5. Mit der Umwandlung
md = md.replace(
  'Mit der Umwandlung in JPG lassen sich die Fotos überall öffnen.',
  'Mit der Umwandlung in JPG lassen sich die Fotos auf deutlich mehr Geräten, Programmen und Websites verwenden.'
);

fs.writeFileSync('src/content/tools/heic-in-jpg.md', md);
