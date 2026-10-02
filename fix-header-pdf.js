const fs = require('fs');
let header = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Regex to remove the entire <li onMouseEnter={() => handleDDEnter('pdf')} ... </li>
// Using a lazy match to capture the whole block up to the next </li>
header = header.replace(/<li onMouseEnter=\{\(\) => handleDDEnter\('pdf'\)\}[\s\S]*?<\/li>/, '');
header = header.replace(/<li onMouseEnter=\{\(\) => handleDDEnter\('misc'\)\}[\s\S]*?<\/li>/, '');

fs.writeFileSync('src/components/Header.tsx', header);
