const fs = require('fs');
let css = fs.readFileSync('src/app/globals.css', 'utf8');

const jpgPngCss = `
/* --- JPG IN PNG TOOL STYLES --- */
.jpg-png-page {
  --soft-blue:#EFF6FF;
}
.jpg-png-page .hero{position:relative;overflow:hidden;background:radial-gradient(500px 240px at 12% 10%,rgba(59,130,246,.24),transparent 70%),radial-gradient(650px 300px at 90% 30%,rgba(96,165,250,.25),transparent 70%),linear-gradient(135deg,var(--navy),#172554 65%,#1E3A8A);color:#fff;padding:20px 0 clamp(92px,11vw,126px)}
.jpg-png-page .hero::after{content:"";position:absolute;width:420px;height:420px;right:-180px;bottom:-260px;border:1px solid rgba(255,255,255,.08);border-radius:50%}
.jpg-png-page .hero .wrap{display:block}
.jpg-png-page .crumbs ol{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:7px;font-size:.875rem;color:#93A4C3}
.jpg-png-page .crumbs li+li::before{content:"/";margin-right:7px;color:#64748B}
.jpg-png-page .crumbs a:hover{color:#fff;text-decoration:underline}
.jpg-png-page .hero-content{max-width:760px;margin-top:clamp(28px,5vw,48px)}
.jpg-png-page .hero h1{margin:0;font-size:clamp(2.15rem,5vw,3.65rem);line-height:1.05;font-weight:800;letter-spacing:-.04em}
.jpg-png-page .hero p.lead{margin:18px 0 0;color:#C7D2E8;font-size:clamp(1rem,1.7vw,1.2rem);max-width:62ch}
.jpg-png-page .hero-points{display:flex;flex-wrap:wrap;gap:10px;list-style:none;margin:26px 0 0;padding:0}
.jpg-png-page .hero-points li{display:flex;align-items:center;gap:8px;padding:7px 12px;border-radius:10px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.13);color:#E2E8F0;font-size:.875rem}
.jpg-png-page .hero-points svg{color:#60A5FA}
.jpg-png-page .tool-shell{margin-top:-72px;position:relative;z-index:2}
.jpg-png-page .converter{display:grid;grid-template-columns:minmax(0,1fr);gap:18px}
.jpg-png-page .upload-card{background:#fff;border:1px solid var(--line);border-radius:22px;box-shadow:0 28px 60px -34px rgba(15,23,42,.5);overflow:hidden}
.jpg-png-page .upload-head{display:flex;justify-content:space-between;align-items:center;gap:15px;padding:18px 22px;border-bottom:1px solid var(--line)}
.jpg-png-page .upload-head h2{margin:0;font-size:1rem}
.jpg-png-page .format-switch{display:flex;align-items:center;gap:6px;font-size:.75rem;font-weight:700;letter-spacing:.04em}
.jpg-png-page .format-switch span{padding:4px 8px;border-radius:6px;background:var(--soft);color:var(--muted)}
.jpg-png-page .format-switch strong{padding:4px 8px;border-radius:6px;background:var(--success-bg);color:var(--success)}
.jpg-png-page .upload-body{padding:22px}
.jpg-png-page .dropzone{min-height:310px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;border:2px dashed #BFDBFE;border-radius:18px;background:linear-gradient(180deg,#F8FBFF,#EFF6FF);padding:42px 22px;transition:background .2s,border-color .2s,transform .2s;cursor:pointer}
.jpg-png-page .dropzone:hover,.jpg-png-page .dropzone.over{border-color:#60A5FA;background:#EAF2FF}
.jpg-png-page .drop-icon{width:72px;height:72px;display:grid;place-items:center;border-radius:18px;background:#DBEAFE;color:var(--primary);margin-bottom:18px}
.jpg-png-page .dropzone strong{font-size:clamp(1.15rem,2.4vw,1.45rem);letter-spacing:-.02em}
.jpg-png-page .dropzone p{margin:7px 0 0;color:var(--muted);font-size:.9375rem}
.jpg-png-page .select-button{margin-top:20px;height:48px;padding:0 22px;display:inline-flex;align-items:center;gap:8px;border-radius:11px;background:var(--primary);color:#fff;font-weight:600;transition:background .2s}
.jpg-png-page .select-button:hover{background:var(--primary-h)}
.jpg-png-page .drop-formats{display:flex;align-items:center;gap:7px;margin-top:16px;font-size:.75rem;font-weight:700}
.jpg-png-page .drop-formats span{padding:4px 9px;border-radius:6px;background:#fff;border:1px solid var(--line);color:var(--muted)}
.jpg-png-page .drop-formats b{color:var(--primary)}
.jpg-png-page .files{margin-top:20px}
.jpg-png-page .file-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.jpg-png-page .file-header h3{margin:0;font-size:1rem}
.jpg-png-page .clear{color:var(--muted);font-size:.875rem;font-weight:600;padding:5px 8px;border-radius:7px;background:none;border:none;cursor:pointer}
.jpg-png-page .clear:hover{background:var(--err-bg);color:var(--err)}
.jpg-png-page .file-list{display:grid;gap:9px;list-style:none;margin:0;padding:0}
.jpg-png-page .file-row{display:grid;grid-template-columns:54px minmax(0,1fr) auto;gap:12px;align-items:center;padding:9px;border:1px solid var(--line);border-radius:13px;background:#fff}
.jpg-png-page .file-row.done{border-color:#A7F3D0}
.jpg-png-page .file-row.fail{border-color:#FECACA}
.jpg-png-page .file-thumb{width:54px;height:54px;display:grid;place-items:center;overflow:hidden;border-radius:9px;border:1px solid var(--line);background:linear-gradient(45deg,#E2E8F0 25%,transparent 25%),linear-gradient(-45deg,#E2E8F0 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#E2E8F0 75%),linear-gradient(-45deg,transparent 75%,#E2E8F0 75%);background-size:12px 12px;background-position:0 0,0 6px,6px -6px,-6px 0}
.jpg-png-page .file-thumb img{width:100%;height:100%;object-fit:contain}
.jpg-png-page .file-name{min-width:0;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.jpg-png-page .file-meta{display:flex;flex-wrap:wrap;align-items:center;gap:5px 8px;margin-top:2px;color:var(--muted);font-size:.8125rem}
.jpg-png-page .type{padding:1px 6px;border-radius:5px;background:var(--soft);font-size:.6875rem;font-weight:700;color:var(--muted)}
.jpg-png-page .type.png{background:var(--success-bg);color:var(--success)}
.jpg-png-page .download{height:38px;padding:0 13px;display:inline-flex;align-items:center;gap:6px;border-radius:9px;background:var(--success);color:#fff;font-size:.875rem;font-weight:600}
.jpg-png-page .download:hover{background:#065F46}
.jpg-png-page .remove{width:38px;height:38px;display:grid;place-items:center;border-radius:9px;color:var(--muted);background:none;border:none;cursor:pointer}
.jpg-png-page .remove:hover{background:var(--soft);color:var(--text)}
.jpg-png-page .action-area{margin-top:18px;display:grid;gap:10px}
.jpg-png-page .progress{height:7px;border-radius:99px;overflow:hidden;background:var(--soft)}
.jpg-png-page .progress i{display:block;width:0;height:100%;background:var(--success);transition:width .3s}
.jpg-png-page .result{padding:12px 14px;border-radius:11px;background:var(--success-bg);color:var(--success);text-align:center;font-weight:600}
.jpg-png-page .primary-button{width:100%;height:52px;display:flex;justify-content:center;align-items:center;gap:8px;border-radius:12px;background:var(--primary);color:#fff;font-weight:700;transition:background .2s;border:none;cursor:pointer}
.jpg-png-page .primary-button:hover:not(:disabled){background:var(--primary-h)}
.jpg-png-page .primary-button:disabled{opacity:.45;cursor:not-allowed}
.jpg-png-page .secondary-button{height:48px;display:flex;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:11px;background:#fff;font-weight:600;cursor:pointer}
.jpg-png-page .secondary-button:hover{border-color:#93C5FD}
.jpg-png-page .privacy{display:flex;justify-content:center;align-items:center;gap:8px;margin:17px 0 2px;color:var(--muted);font-size:.8125rem;text-align:center}
.jpg-png-page .privacy svg{color:var(--success);flex:none}
.jpg-png-page .settings{background:#fff;border:1px solid var(--line);border-radius:20px;box-shadow:0 18px 40px -30px rgba(15,23,42,.4);overflow:hidden;margin:0}
.jpg-png-page .settings-title{padding:18px 20px;border-bottom:1px solid var(--line);font-size:1rem;font-weight:700}
.jpg-png-page .settings-body{padding:20px;display:grid;gap:23px}
.jpg-png-page .setting h3{margin:0 0 8px;font-size:.875rem}
.jpg-png-page .setting-description{margin:6px 0 0;color:var(--muted);font-size:.8125rem;line-height:1.45}
.jpg-png-page .option-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.jpg-png-page .option{position:relative}
.jpg-png-page .option input{position:absolute;opacity:0}
.jpg-png-page .option label{min-height:58px;display:flex;flex-direction:column;justify-content:center;padding:9px 11px;border:1px solid var(--line);border-radius:10px;background:#fff;cursor:pointer}
.jpg-png-page .option input:checked+label{border-color:var(--primary);background:var(--soft-blue);box-shadow:0 0 0 3px rgba(29,78,216,.1)}
.jpg-png-page .option label strong{font-size:.8125rem}
.jpg-png-page .option label small{margin-top:2px;color:var(--muted);font-size:.6875rem}
.jpg-png-page .transparency{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.jpg-png-page .transparency label{height:42px;display:flex;align-items:center;gap:8px;padding:0 10px;border:1px solid var(--line);border-radius:10px;font-size:.8125rem;font-weight:500;cursor:pointer}
.jpg-png-page .transparency input{accent-color:var(--primary)}
.jpg-png-page select, .jpg-png-page .number{width:100%;height:42px;padding:0 11px;border:1px solid var(--line);border-radius:10px;background:#fff}
.jpg-png-page .number{margin-top:8px}
.jpg-png-page .filename-options{display:grid;gap:7px}
.jpg-png-page .switch{display:flex;justify-content:space-between;gap:15px}
.jpg-png-page .switch label{font-size:.875rem;font-weight:600;margin:0}
.jpg-png-page .switch label small{display:block;margin-top:2px;color:var(--muted);font-size:.8125rem;line-height:1.4;font-weight:400}
.jpg-png-page .switch input{appearance:none;flex:none;width:44px;height:26px;border-radius:99px;background:#CBD5E1;position:relative;cursor:pointer;transition:background .2s;margin:0}
.jpg-png-page .switch input::after{content:"";position:absolute;width:20px;height:20px;top:3px;left:3px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .2s}
.jpg-png-page .switch input:checked{background:var(--success)}
.jpg-png-page .switch input:checked::after{transform:translateX(18px)}
.jpg-png-page .info{display:flex;gap:9px;padding:12px;border-radius:11px;background:#EFF6FF;color:#1E40AF;font-size:.8125rem;line-height:1.45}
.jpg-png-page .info svg{flex:none;margin-top:1px}
.jpg-png-page .reset{justify-self:start;color:var(--muted);font-size:.8125rem;font-weight:600;background:none;border:none;cursor:pointer}
.jpg-png-page .reset:hover{color:var(--primary)}
.jpg-png-page .content{padding:clamp(44px,6vw,74px) 0 0}
.jpg-png-page .content h2{margin:0 0 14px;font-size:clamp(1.4rem,3vw,1.9rem);line-height:1.2;letter-spacing:-.025em}
.jpg-png-page .content > p{max-width:70ch;margin:0 0 16px;color:#334155}
.jpg-png-page .info-grid{display:grid;gap:14px;margin-top:22px}
.jpg-png-page .info-card{padding:21px;border:1px solid var(--line);border-radius:16px;background:#fff}
.jpg-png-page .info-card .icon{width:42px;height:42px;display:grid;place-items:center;margin-bottom:13px;border-radius:11px;background:var(--soft-blue);color:var(--primary)}
.jpg-png-page .info-card h3{margin:0 0 5px;font-size:1.05rem}
.jpg-png-page .info-card p{margin:0;color:var(--muted);font-size:.9375rem}
.jpg-png-page .narrow{max-width:820px}
@media(min-width:640px){
  .jpg-png-page .action-buttons{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .jpg-png-page .info-grid{grid-template-columns:repeat(3,1fr)}
  .jpg-png-page .related{grid-template-columns:1fr 1fr}
}
@media(min-width:1024px){
  .jpg-png-page .converter{grid-template-columns:minmax(0,1fr) 350px;align-items:start}
  .jpg-png-page .settings{position:sticky;top:88px}
  .jpg-png-page .upload-card{min-width:0}
}
@media(max-width:639px){
  .jpg-png-page .upload-head{align-items:flex-start;flex-direction:column}
  .jpg-png-page .dropzone{min-height:280px}
  .jpg-png-page .file-row{grid-template-columns:48px minmax(0,1fr) auto}
  .jpg-png-page .file-thumb{width:48px;height:48px}
  .jpg-png-page .download span{display:none}
  .jpg-png-page .download{width:38px;padding:0;justify-content:center}
}
`;

if (!css.includes('.jpg-png-page .hero')) {
  css += '\n' + jpgPngCss;
  fs.writeFileSync('src/app/globals.css', css);
}
