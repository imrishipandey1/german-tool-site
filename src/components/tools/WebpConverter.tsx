"use client";
import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';

type FileItem = {
  id: number;
  file: File;
  status: 'ready' | 'busy' | 'done' | 'error';
  url: string;
  out?: { blob: Blob; size: number; url: string };
};

export default function WebpConverter() {
  const [items, setItems] = useState<FileItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  
  // Settings
  const [quality, setQuality] = useState(85);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [customColor, setCustomColor] = useState('#1d4ed8');
  const [sizeMode, setSizeMode] = useState('');
  const [customWidth, setCustomWidth] = useState('');
  const [suffix, setSuffix] = useState('');
  const [stripExif, setStripExif] = useState(true);
  const [progressive, setProgressive] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [setOpen, setSetOpen] = useState(true);

  const uidRef = useRef(0);
  const dzRef = useRef<HTMLLabelElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width:1024px)');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDesktop(mq.matches);
    if(mq.matches) setSetOpen(true);
    const cb = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
      if(e.matches) setSetOpen(true);
    };
    mq.addEventListener('change', cb);
    return () => mq.removeEventListener('change', cb);
  }, []);

  const resetResults = () => {
    if (busy) return;
    setItems(prev => prev.map(i => {
      if (i.out) URL.revokeObjectURL(i.out.url);
      return { ...i, out: undefined, status: 'ready' };
    }));
  };

  const handleQuality = (q: number) => {
    setQuality(q);
    resetResults();
  };

  const handleAddFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newItems: FileItem[] = [];
    const bad: string[] = [];
    
    Array.from(files).forEach(f => {
      if (f.type !== 'image/webp' && !/\.webp$/i.test(f.name)) {
        bad.push(f.name);
        return;
      }
      uidRef.current++;
      newItems.push({
        id: uidRef.current,
        file: f,
        status: 'ready',
        url: URL.createObjectURL(f)
      });
    });

    if (bad.length > 0) {
      setMsg(`Übersprungen (nur WebP-Dateien): ${bad.slice(0, 3).join(', ')}${bad.length > 3 ? ` und ${bad.length - 3} weitere` : ''}`);
    } else {
      setMsg('');
    }

    if (newItems.length > 0) {
      setItems(prev => [...prev, ...newItems]);
    }
  };

  const removeAll = () => {
    if (busy) return;
    items.forEach(i => {
      URL.revokeObjectURL(i.url);
      if (i.out) URL.revokeObjectURL(i.out.url);
    });
    setItems([]);
    setMsg('');
  };

  const removeItem = (id: number) => {
    if (busy) return;
    setItems(prev => {
      const it = prev.find(i => i.id === id);
      if (it) {
        URL.revokeObjectURL(it.url);
        if (it.out) URL.revokeObjectURL(it.out.url);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const getOutName = (name: string) => {
    return name.replace(/\.webp$/i, '') + suffix + '.jpg';
  };

  const convertImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        
        let mw = null;
        if (sizeMode === 'custom' && customWidth) {
          mw = parseInt(customWidth, 10);
        } else if (sizeMode !== 'custom' && sizeMode) {
          mw = parseInt(sizeMode, 10);
        }

        if (mw && w > mw) {
          h = Math.round((h * mw) / w);
          w = mw;
        }

        const cvs = document.createElement('canvas');
        cvs.width = w;
        cvs.height = h;
        const ctx = cvs.getContext('2d');
        if (!ctx) return reject('No context');

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        
        // standard canvas toBlob only creates baseline JPG, dropping EXIF automatically.
        cvs.toBlob(b => {
          if (b) resolve(b);
          else reject('Blob failed');
        }, 'image/jpeg', quality / 100);
      };
      img.onerror = () => reject('Load failed');
      img.src = URL.createObjectURL(file);
    });
  };

  const runConvert = async () => {
    if (busy) return;
    setBusy(true);
    
    const todoIds = items.filter(i => i.status !== 'done').map(i => i.id);
    
    for (const id of todoIds) {
      setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'busy' } : i));
      
      const it = items.find(i => i.id === id);
      if (!it) continue;
      
      try {
        const blob = await convertImage(it.file);
        const url = URL.createObjectURL(blob);
        setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'done', out: { blob, size: blob.size, url } } : i));
      } catch (e) {
        setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'error' } : i));
      }
    }
    
    setBusy(false);
  };

  const dlAll = async () => {
    const done = items.filter(i => i.status === 'done' && i.out);
    if (done.length === 0) return;
    if (done.length === 1) {
      const a = document.createElement('a');
      a.href = done[0].out!.url;
      a.download = getOutName(done[0].file.name);
      a.click();
      return;
    }
    
    const zip = new JSZip();
    done.forEach(it => {
      zip.file(getOutName(it.file.name), it.out!.blob);
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(zipBlob);
    a.download = 'ZappTool-Bilder.zip';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const fmt = (b: number) => {
    const nf = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 });
    return b < 1024 ? b + ' B' : b < 1048576 ? nf.format(b / 1024) + ' KB' : nf.format(b / 1048576) + ' MB';
  };

  // Stats
  const doneItems = items.filter(i => i.status === 'done' && i.out);
  const pendingItems = items.filter(i => i.status !== 'done');
  const allSize = items.reduce((s, i) => s + i.file.size, 0);
  const doneInSize = doneItems.reduce((s, i) => s + i.file.size, 0);
  const doneOutSize = doneItems.reduce((s, i) => s + (i.out?.size || 0), 0);
  const saving = doneInSize > 0 ? Math.round((1 - doneOutSize / doneInSize) * 100) : 0;

  return (
    <div className="bench" id="tool" style={{ '--prev': bgColor } as React.CSSProperties}>
      
      {/* ===== LINKS: Dateien ===== */}
      <section className="card main-col" aria-label="WebP in JPG Converter">
        <label 
          className={`dz ${items.length > 0 ? 'mini' : ''}`}
          ref={dzRef}
          onDragOver={e => { e.preventDefault(); dzRef.current?.classList.add('over'); }}
          onDragLeave={() => dzRef.current?.classList.remove('over')}
          onDrop={e => { e.preventDefault(); dzRef.current?.classList.remove('over'); handleAddFiles(e.dataTransfer.files); }}
        >
          <span className="ic"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 16V4m-5 5 5-5 5 5M5 20h14"/></svg></span>
          <strong>WebP-Dateien hierher ziehen</strong>
          <small>oder klicken zum Auswählen · Einfügen mit Strg + V</small>
          <span className="fmts" aria-hidden="true"><b>WEBP</b><span style={{alignSelf:'center',color:'var(--muted)'}}>→</span><b>JPG</b></span>
          <span className="btn p" style={{ pointerEvents: items.length ? 'auto' : 'none' }}>
            {items.length ? 'Weitere Dateien hinzufügen' : 'WebP-Dateien auswählen'}
          </span>
          <input className="sr" id="file" type="file" accept=".webp,image/webp" multiple ref={fileInputRef} onChange={e => { handleAddFiles(e.target.files); e.target.value = ''; }} />
        </label>
        
        {msg && <p className="msg" role="alert">{msg}</p>}

        <div id="panel" hidden={items.length === 0}>
          <div className="lh">
            <h2>Ihre Dateien <span className="st tn">· {items.length} {items.length === 1 ? 'Datei' : 'Dateien'} · {fmt(allSize)}</span></h2>
            <button className="wlink" type="button" onClick={removeAll}>Alle entfernen</button>
          </div>
          <ul className="list" aria-live="polite">
            {items.map(it => {
              let p = 0;
              if (it.out) p = Math.round((1 - it.out.size / it.file.size) * 100);
              return (
                <li key={it.id} className={`row ${it.status === 'done' ? 'done' : ''} ${it.status === 'error' ? 'fail' : ''}`}>
                  <div className="thumb"><img src={it.url} alt="" /></div>
                  <div style={{minWidth: 0}}>
                    <div className="name">{it.file.name}</div>
                    <div className="meta">
                      <span className="fmt">WEBP</span><span className="tn">{fmt(it.file.size)}</span>
                      {it.status === 'busy' && <span>Wird umgewandelt …</span>}
                      {it.status === 'error' && <span style={{color:'var(--err)'}}>Fehlgeschlagen</span>}
                      {it.status === 'done' && it.out && (
                        <>
                          <span aria-hidden="true">→</span><span className="fmt jpg">JPG</span><b className="tn">{fmt(it.out.size)}</b>
                          {p > 0 ? <span className="chip tn">−{p} %</span> : <span className="chip up tn">+{Math.abs(p)} %</span>}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="act">
                    {it.status === 'done' && it.out && (
                      <a className="dl" href={it.out.url} download={getOutName(it.file.name)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11m-5-4 5 5 5-5M5 20h14"/></svg>
                        <span>Laden</span>
                      </a>
                    )}
                    <button className="rm" type="button" onClick={() => removeItem(it.id)} aria-label={`${it.file.name} entfernen`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
                    </button>
                  </div>
                  {it.status === 'busy' && <div className="rbar"></div>}
                </li>
              );
            })}
          </ul>
          
          <div className="foot">
            <div className="total" hidden={!busy}><i style={{ width: `${items.length ? (doneItems.length / items.length) * 100 : 0}%` }}></i></div>
            
            {doneItems.length > 0 && pendingItems.length === 0 && (
              <div className="sum tn">
                {doneItems.length} {doneItems.length > 1 ? 'Dateien' : 'Datei'} fertig · {fmt(doneInSize)} → {fmt(doneOutSize)} 
                {saving > 0 ? ` (−${saving} %)` : ` (+${Math.abs(saving)} %)`}
              </div>
            )}
            
            <div className="btns">
              {doneItems.length > 1 && (
                <button className="btn s" type="button" onClick={dlAll}>Alle als ZIP laden</button>
              )}
              <span className="sp" hidden={doneItems.length <= 1}></span>
              <button className="btn p" type="button" id="go" onClick={runConvert} disabled={busy || pendingItems.length === 0} style={doneItems.length <= 1 ? { gridColumn: '3' } : {}}>
                {busy ? 'Wird umgewandelt …' : 'In JPG umwandeln'}
              </button>
            </div>
          </div>
        </div>
        
        <p className="priv" style={{ margin: '16px 0 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '.875rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: 'var(--success)' }}><rect x="5" y="10" width="14" height="10" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
          Ihre Dateien werden nicht hochgeladen. Alles passiert auf Ihrem Gerät.
        </p>
      </section>

      {/* ===== RECHTS: Einstellungen ===== */}
      <details className="card set" open={setOpen} onToggle={e => setSetOpen((e.target as HTMLDetailsElement).open)}>
        <summary style={isDesktop ? { pointerEvents: 'none' } : {}}>Einstellungen</summary>
        <div className="sbody">

          <div className="f">
            <h3>JPG-Qualität</h3>
            <div className="seg" role="group" aria-label="Qualität-Voreinstellung">
              <button type="button" aria-pressed={quality === 70} onClick={() => handleQuality(70)}>Klein</button>
              <button type="button" aria-pressed={quality === 85} onClick={() => handleQuality(85)}>Standard</button>
              <button type="button" aria-pressed={quality === 92} onClick={() => handleQuality(92)}>Hoch</button>
              <button type="button" aria-pressed={quality === 100} onClick={() => handleQuality(100)}>Max</button>
            </div>
            <div className="range">
              <input type="range" min="40" max="100" step="1" value={quality} onChange={e => { setQuality(parseInt(e.target.value)); resetResults(); }} aria-label="Qualität in Prozent" />
              <output className="tn">{quality} %</output>
            </div>
          </div>

          <div className="f">
            <h3>Hintergrund bei Transparenz</h3>
            <div className="sws" role="radiogroup" aria-label="Hintergrundfarbe">
              <label className="sw"><input type="radio" name="bg" value="#ffffff" checked={bgColor === '#ffffff'} onChange={() => { setBgColor('#ffffff'); resetResults(); }} /><span><i className="dot" style={{ background: '#fff' }}></i>Weiß</span></label>
              <label className="sw"><input type="radio" name="bg" value="#000000" checked={bgColor === '#000000'} onChange={() => { setBgColor('#000000'); resetResults(); }} /><span><i className="dot" style={{ background: '#000' }}></i>Schwarz</span></label>
              
              <div className="sw" style={{ display: 'inline-block' }}>
                <input type="radio" name="bg" value={customColor} checked={bgColor === customColor} style={{ pointerEvents: 'none' }} readOnly />
                <span onClick={(e) => { 
                  setBgColor(customColor); 
                  resetResults();
                  const el = (e.currentTarget as HTMLElement).querySelector('input[type="color"]') as HTMLInputElement;
                  if(el) el.click();
                }}>
                  <input type="color" value={customColor} onChange={(e) => { setCustomColor(e.target.value); setBgColor(e.target.value); resetResults(); }} onClick={(e) => e.stopPropagation()} aria-label="Eigene Farbe" />
                  Eigene
                </span>
              </div>
            </div>
            <p>WebP kann transparent sein, JPG nicht. Diese Farbe füllt die transparenten Stellen.</p>
          </div>

          <div className="f">
            <h3>Größe anpassen</h3>
            <select aria-label="Maximale Breite" value={sizeMode} onChange={e => { setSizeMode(e.target.value); resetResults(); }}>
              <option value="">Originalgröße beibehalten</option>
              <option value="3840">Max. 3840 px (4K)</option>
              <option value="1920">Max. 1920 px (Full HD)</option>
              <option value="1280">Max. 1280 px</option>
              <option value="800">Max. 800 px</option>
              <option value="custom">Eigene Breite …</option>
            </select>
            {sizeMode === 'custom' && (
              <input className="num" type="number" min="16" max="10000" placeholder="Breite in Pixel" aria-label="Eigene maximale Breite" value={customWidth} onChange={e => { setCustomWidth(e.target.value); resetResults(); }} />
            )}
            <p>Das Seitenverhältnis bleibt erhalten. Kleinere Bilder werden nicht vergrößert.</p>
          </div>

          <div className="f">
            <h3>Dateiname</h3>
            <select aria-label="Dateiname" value={suffix} onChange={e => { setSuffix(e.target.value); resetResults(); }}>
              <option value="">bild.jpg (Originalname)</option>
              <option value="-konvertiert">bild-konvertiert.jpg</option>
              <option value="-web">bild-web.jpg</option>
            </select>
          </div>

          <div className="f" style={{ display: 'grid', gap: '14px' }}>
            <div className="tg">
              <label>Metadaten entfernen<small>Löscht Kamera- und Standortdaten (EXIF) aus dem Ergebnis.</small></label>
              <input type="checkbox" role="switch" checked={stripExif} onChange={e => { setStripExif(e.target.checked); resetResults(); }} />
            </div>
            <div className="tg">
              <label>Progressives JPG<small>Baut sich auf Webseiten schrittweise auf.</small></label>
              <input type="checkbox" role="switch" checked={progressive} onChange={e => { setProgressive(e.target.checked); resetResults(); }} />
            </div>
          </div>

          <div className="note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></svg>
            <span>Bei animierten WebP-Dateien wird nur das erste Bild übernommen.</span>
          </div>
          
          <button className="rst" type="button" onClick={() => {
            setQuality(85);
            setBgColor('#ffffff');
            setSizeMode('');
            setCustomWidth('');
            setSuffix('');
            setStripExif(true);
            setProgressive(false);
            resetResults();
          }}>Einstellungen zurücksetzen</button>
        </div>
      </details>
    </div>
  );
}
