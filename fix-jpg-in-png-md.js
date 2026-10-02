const fs = require('fs');

let md = fs.readFileSync('src/content/tools/jpg-in-png.md', 'utf8');

const newRelBlock = `<ul class="related">
    <li><a href="/png-in-jpg">PNG in JPG <span aria-hidden="true">→</span></a></li>
    <li><a href="/heic-in-jpg">HEIC in JPG <span aria-hidden="true">→</span></a></li>
    <li><a href="/webp-in-jpg">WebP in JPG <span aria-hidden="true">→</span></a></li>
  </ul>`;

md = md.replace(/<ul class="related">[\s\S]*?<\/ul>/, newRelBlock);

fs.writeFileSync('src/content/tools/jpg-in-png.md', md);
