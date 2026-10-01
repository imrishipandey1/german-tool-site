const fs = require('fs');
let css = fs.readFileSync('src/app/globals.css', 'utf8');

const missingSw = `
.tg{display:grid;grid-template-columns:1fr auto;gap:14px;align-items:center}
.sw{position:relative;width:48px;height:28px;flex:none}
.sw i{position:absolute;inset:0;border-radius:999px;background:#CBD5E1;transition:background .2s}
.sw i::after{content:"";position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3);transition:transform .2s}
.sw input:checked+i{background:var(--success)}
.sw input:checked+i::after{transform:translateX(20px)}
.sw input:focus-visible+i{outline:3px solid var(--primary);outline-offset:2px}
`;

if (!css.includes('.sw i{position:absolute')) {
  css = css.replace('/* --- HEIC TOOL STYLES --- */', '/* --- HEIC TOOL STYLES --- */\\n' + missingSw);
  fs.writeFileSync('src/app/globals.css', css);
}
