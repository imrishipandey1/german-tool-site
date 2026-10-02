const fs = require('fs');
const path = require('path');

const files = ['png-in-jpg.md', 'jpg-in-png.md', 'heic-in-jpg.md', 'webp-in-jpg.md'];
const liveTools = [
  { slug: "png-in-jpg", name: "PNG in JPG" },
  { slug: "jpg-in-png", name: "JPG in PNG" },
  { slug: "heic-in-jpg", name: "HEIC in JPG" },
  { slug: "webp-in-jpg", name: "WebP in JPG" }
];

for (const file of files) {
  const filePath = path.join('src/content/tools', file);
  let md = fs.readFileSync(filePath, 'utf8');
  
  // Figure out the current slug
  const currentSlug = file.replace('.md', '');
  
  // Build new links
  const linksHtml = liveTools
    .filter(t => t.slug !== currentSlug)
    .map(t => `    <li><a href="/${t.slug}">${t.name} <span aria-hidden="true">→</span></a></li>`)
    .join('\n');
    
  const newRelBlock = `<ul class="rel">\n${linksHtml}\n  </ul>`;
  
  // Replace existing block
  md = md.replace(/<ul class="rel">[\s\S]*?<\/ul>/, newRelBlock);
  fs.writeFileSync(filePath, md);
}
