const fs = require('fs');
let css = fs.readFileSync('src/app/globals.css', 'utf8');

const webpCss = `
/* --- WEBP TOOL STYLES --- */
.webp-page {
  --navy: #0B1220;
  --soft: #F1F5F9;
}
.webp-page .hero{background:radial-gradient(900px 300px at 85% -20%,rgba(96,165,250,.35),transparent 60%),linear-gradient(135deg,var(--navy),#172554 70%,#1E3A8A);color:#fff;padding:20px 0 clamp(88px,10vw,112px)}
.webp-page .hero h1{margin:clamp(20px,4vw,36px) 0 0;font-size:clamp(2rem,5vw,3.5rem);font-weight:800;letter-spacing:-.03em;line-height:1.08;max-width:18ch}
.webp-page .hero p.lead{margin:14px 0 0;color:#C7D2E8;font-size:clamp(1rem,1.6vw,1.1875rem);max-width:58ch}
.webp-page .pills{list-style:none;margin:22px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.webp-page .pills li{display:flex;align-items:center;gap:7px;padding:6px 13px;border-radius:999px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.16);font-size:.875rem;font-weight:500}
.webp-page .pills svg{color:#6EE7B7}
.webp-page .bench{display:grid;gap:18px;margin-top:-64px;align-items:start}
.webp-page .card{background:var(--card);border:1px solid var(--line);border-radius:20px;box-shadow:0 24px 48px -30px rgba(15,23,42,.45)}
.webp-page .main-col{padding:clamp(14px,2.2vw,22px)}
.webp-page .dz{--c:var(--primary);display:grid;justify-items:center;text-align:center;gap:8px;padding:clamp(34px,6vw,64px) 20px;border-radius:14px;cursor:pointer;border:1px solid var(--line);transition:background-color .2s,border-color .2s;
  background-color:var(--soft);
  background-image:linear-gradient(var(--c),var(--c)),linear-gradient(var(--c),var(--c)),linear-gradient(var(--c),var(--c)),linear-gradient(var(--c),var(--c)),linear-gradient(var(--c),var(--c)),linear-gradient(var(--c),var(--c)),linear-gradient(var(--c),var(--c)),linear-gradient(var(--c),var(--c));
  background-repeat:no-repeat;
  background-size:26px 3px,3px 26px,26px 3px,3px 26px,26px 3px,3px 26px,26px 3px,3px 26px;
  background-position:left 12px top 12px,left 12px top 12px,right 12px top 12px,right 12px top 12px,left 12px bottom 12px,left 12px bottom 12px,right 12px bottom 12px,right 12px bottom 12px}
.webp-page .dz:hover,.webp-page .dz.over{background-color:#E0ECFF;border-color:var(--drop-b)}
.webp-page .dz:focus-within{outline:3px solid var(--primary);outline-offset:2px}
.webp-page .dz .ic{width:60px;height:60px;border-radius:50%;background:var(--primary);color:#fff;display:grid;place-items:center;box-shadow:0 10px 20px -10px rgba(29,78,216,.8)}
.webp-page .dz strong{font-size:clamp(1.125rem,2.4vw,1.4rem);letter-spacing:-.015em; margin: 0;}
.webp-page .dz small{color:var(--muted);font-size:.9375rem}
.webp-page .dz .fmts{display:flex;gap:6px;margin-top:2px}
.webp-page .dz .fmts b{font-size:.75rem;padding:2px 9px;border-radius:6px;background:#fff;border:1px solid var(--line)}
.webp-page .dz .btn{margin-top:8px;pointer-events:none}
.webp-page .dz.mini{grid-auto-flow:column;justify-content:center;gap:12px;padding:14px 16px;background-image:none}
.webp-page .dz.mini .ic,.webp-page .dz.mini small,.webp-page .dz.mini strong,.webp-page .dz.mini .fmts{display:none}
.webp-page .dz.mini .btn{margin:0;height:44px}
.webp-page .lh{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:18px 0 10px}
.webp-page .lh h2{margin:0;font-size:1rem}
.webp-page .lh .st{color:var(--muted);font-size:.875rem;font-weight:500}
.webp-page .wlink{background:none;border:none;cursor:pointer;color:var(--muted);font-size:.875rem;font-weight:600;padding:6px 8px;border-radius:8px}
.webp-page .wlink:hover{color:var(--err);background:var(--err-bg)}
.webp-page .list{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.webp-page .row{display:grid;grid-template-columns:60px 1fr auto;gap:14px;align-items:center;padding:10px;border:1px solid var(--line);border-radius:14px;background:#fff;position:relative;overflow:hidden}
.webp-page .row.done{border-color:#A7F3D0}
.webp-page .row.fail{border-color:#FECACA}
.webp-page .thumb{width:60px;height:60px;border-radius:10px;overflow:hidden;background:var(--prev);border:1px solid var(--line)}
.webp-page .thumb img{width:100%;height:100%;object-fit:contain}
.webp-page .name{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.webp-page .meta{font-size:.875rem;color:var(--muted);display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;margin-top:2px}
.webp-page .fmt{font-size:.6875rem;font-weight:700;letter-spacing:.04em;padding:1px 6px;border-radius:5px;background:var(--soft);color:var(--muted)}
.webp-page .fmt.jpg{background:var(--success-bg);color:var(--success)}
.webp-page .rbar{position:absolute;left:0;right:0;bottom:0;height:3px;background:#DBEAFE;overflow:hidden}
.webp-page .rbar::after{content:"";position:absolute;inset:0;width:40%;background:var(--primary);animation:ind 1.1s ease-in-out infinite}
@keyframes ind{from{transform:translateX(-100%)}to{transform:translateX(260%)}}
.webp-page .foot{margin-top:16px;display:grid;gap:10px}
.webp-page .total{height:8px;border-radius:99px;background:var(--soft);overflow:hidden}
.webp-page .total i{display:block;height:100%;width:0;background:var(--success);transition:width .3s}
.webp-page .sum{padding:12px 14px;border-radius:12px;background:var(--success-bg);color:var(--success);font-weight:600;text-align:center}
.webp-page .btns{display:grid;gap:10px}
.webp-page .set{padding:0}
.webp-page .set summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;padding:16px 18px;font-weight:700}
.webp-page .set summary::-webkit-details-marker{display:none}
.webp-page .set summary::after{content:"";width:9px;height:9px;border-right:2.5px solid var(--muted);border-bottom:2.5px solid var(--muted);transform:rotate(45deg);transition:transform .2s;margin-top:-4px}
.webp-page .set[open] summary::after{transform:rotate(-135deg);margin-top:4px}
.webp-page .sbody{padding:0 18px 18px;display:grid;gap:20px}
.webp-page .f h3{margin:0 0 8px;font-size:.875rem;font-weight:700}
.webp-page .f p{margin:6px 0 0;color:var(--muted);font-size:.8125rem;line-height:1.45}
.webp-page .seg{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:4px;background:var(--soft);border-radius:12px}
.webp-page .seg button{height:38px;border-radius:9px;font-size:.8125rem;font-weight:600;color:var(--muted);transition:background .15s,color .15s;background:none;border:none;cursor:pointer}
.webp-page .seg button[aria-pressed=true]{background:#fff;color:var(--primary);box-shadow:0 1px 3px rgba(15,23,42,.15)}
.webp-page .range{display:flex;align-items:center;gap:12px;margin-top:10px}
.webp-page .range input{flex:1;accent-color:var(--primary);min-width:0}
.webp-page .range output{min-width:48px;text-align:right;font-weight:700}
.webp-page select, .webp-page .num{width:100%;height:42px;padding:0 12px;border:1px solid var(--line);border-radius:10px;background:#fff}
.webp-page .num{margin-top:8px}
.webp-page .tg{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
.webp-page .tg label{font-size:.875rem;font-weight:600;cursor:pointer;margin:0}
.webp-page .tg label small{display:block;color:var(--muted);font-weight:400;font-size:.8125rem;line-height:1.4;margin-top:2px}
.webp-page .tg input{appearance:none;flex:none;width:44px;height:26px;border-radius:99px;background:#CBD5E1;position:relative;cursor:pointer;transition:background .2s;margin:0}
.webp-page .tg input::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 2px rgba(0,0,0,.25)}
.webp-page .tg input:checked{background:var(--success)}.webp-page .tg input:checked::after{transform:translateX(18px)}
.webp-page .note{display:flex;gap:10px;padding:12px;border-radius:12px;background:#FFFBEB;color:#92400E;font-size:.8125rem;line-height:1.45}
.webp-page .note svg{flex:none;margin-top:1px}
.webp-page .rst{justify-self:start;background:none;border:none;cursor:pointer;color:var(--muted);font-weight:600;font-size:.875rem}
.webp-page .rst:hover{color:var(--text);text-decoration:underline}
.webp-page .uses{display:grid;gap:14px;margin-top:20px}
.webp-page .use{background:#fff;border:1px solid var(--line);border-radius:16px;padding:20px}
.webp-page .use i{width:40px;height:40px;border-radius:12px;background:var(--soft);color:var(--primary);display:grid;place-items:center;margin-bottom:12px}
.webp-page .use h3{margin:0 0 4px;font-size:1.0625rem}
.webp-page .use p{margin:0;color:var(--muted);font-size:.9375rem}

@media(min-width:640px){
  .webp-page .btns{grid-template-columns:auto 1fr auto;align-items:center}
  .webp-page .btns #go{grid-column:3}
  .webp-page .uses{grid-template-columns:repeat(3,1fr)}
  .webp-page .row{grid-template-columns:60px 1fr auto}
}
@media(max-width:639px){
  .webp-page .row{grid-template-columns:48px 1fr auto;gap:10px}
  .webp-page .thumb{width:48px;height:48px}
}
@media(min-width:1024px){
  .webp-page .bench{grid-template-columns:minmax(0,1fr) 360px}
  .webp-page .set{position:sticky;top:88px}
  .webp-page .set summary{cursor:default;pointer-events:none}
  .webp-page .set summary::after{display:none}
  .webp-page .sbody{padding-top:4px}
}
`;

if (!css.includes('.webp-page .hero')) {
  css += '\n' + webpCss;
  fs.writeFileSync('src/app/globals.css', css);
}
