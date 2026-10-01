"use client";
import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';

type FileItem = {
  id: number;
  file: File;
  url: string;
  status: 'ready' | 'busy' | 'done' | 'error';
  out?: { blob: Blob; size: number; url: string };
};

export default function ImageConverter() {
  const [items, setItems] = useState<FileItem[]>([]);
  const [isOver, setIsOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [bg, setBg] = useState('#ffffff');
  const [customBg, setCustomBg] = useState('#1d4ed8');
  const [useCustomBg, setUseCustomBg] = useState(false);
  const [quality, setQuality] = useState(90);
  
  // Advanced options state
  const [nameRule, setNameRule] = useState('standard');
  const [customName, setCustomName] = useState('bild');
  
  const uidRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeBg = useCustomBg ? customBg : bg;

  useEffect(() => {
    document.documentElement.style.setProperty('--prev', activeBg);
  }, [activeBg]);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    let filesArray = Array.from(files);
    let limitMsg = '';
    
    if (items.length + filesArray.length > 50) {
      const allowed = 50 - items.length;
      if (allowed <= 0) {
        setMsg('Maximal 50 Bilder gleichzeitig erlaubt.');
        return;
      }
      filesArray = filesArray.slice(0, allowed);
      limitMsg = ' (Maximal 50 Bilder erlaubt. Restliche wurden ignoriert)';
    }

    const bad: string[] = [];
    let added = 0;
    const newItems: FileItem[] = [];
    filesArray.forEach((f) => {
      if (f.type !== 'image/png' && !/\.png$/i.test(f.name)) {
        bad.push(f.name);
        return;
      }
      uidRef.current++;
      newItems.push({ id: uidRef.current, file: f, url: URL.createObjectURL(f), status: 'ready' });
      added++;
    });
    if (bad.length > 0) {
      const bStr = bad.slice(0, 3).join(', ') + (bad.length > 3 ? ' und ' + (bad.length - 3) + ' weitere' : '');
      setMsg('Übersprungen (nur PNG-Dateien): ' + bStr + limitMsg);
    } else {
      setMsg(limitMsg ? 'Maximal 50 Bilder gleichzeitig erlaubt. Überzählige Dateien wurden ignoriert.' : '');
    }
    if (added > 0) {
      setItems((prev) => [...prev, ...newItems]);
    }
  };

  const resetResults = () => {
    if (busy) return;
    setItems((prev) =>
      prev.map((it) => {
        if (it.out) URL.revokeObjectURL(it.out.url);
        return { ...it, status: 'ready', out: undefined };
      })
    );
  };

  const removeFile = (id: number) => {
    if (busy) return;
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        URL.revokeObjectURL(item.url);
        if (item.out) URL.revokeObjectURL(item.out.url);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const removeAll = () => {
    if (busy) return;
    items.forEach((i) => {
      URL.revokeObjectURL(i.url);
      if (i.out) URL.revokeObjectURL(i.out.url);
    });
    setItems([]);
    setMsg('');
  };

  const convertPngToJpg = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = activeBg;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(url);
              if (blob) resolve(blob);
              else reject(new Error('Conversion failed'));
            },
            'image/jpeg',
            quality / 100
          );
        } else {
          reject(new Error('Canvas ctx null'));
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = url;
    });
  };

  const handleConvert = async () => {
    if (busy) return;
    setBusy(true);
    const todoIds = items.filter((i) => i.status !== 'done').map((i) => i.id);
    
    setItems((prev) => prev.map((i) => (todoIds.includes(i.id) ? { ...i, status: 'busy' } : i)));

    for (const id of todoIds) {
      const item = items.find((i) => i.id === id);
      if (!item) continue;
      try {
        const blob = await convertPngToJpg(item.file);
        setItems((prev) =>
          prev.map((i) => {
            if (i.id === id) {
              return { ...i, status: 'done', out: { blob, size: blob.size, url: URL.createObjectURL(blob) } };
            }
            return i;
          })
        );
      } catch {
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'error' } : i)));
      }
    }
    setBusy(false);
  };

  const getOutName = (orig: string, idx: number, total: number) => {
    const base = orig.replace(/\.png$/i, '');
    let res = base;
    if (nameRule === 'lowercase') {
      res = base.toLowerCase();
    } else if (nameRule === 'slug') {
      res = base.toLowerCase().replace(/[^a-z0-9äöüß]+/gi, '-').replace(/(^-|-$)/g, '');
    } else if (nameRule === 'underscore') {
      res = base.toLowerCase().replace(/[^a-z0-9äöüß]+/gi, '_').replace(/(^_|_$)/g, '');
    } else if (nameRule === 'custom') {
      res = customName.trim() || 'bild';
      if (total > 1) {
        res += `-${idx + 1}`;
      }
    }
    return res + '.jpg';
  };

  const dlAll = async () => {
    const done = items.filter((i) => i.status === 'done' && i.out);
    if (done.length === 0) return;
    
    if (done.length === 1) {
      const it = done[0];
      const a = document.createElement('a');
      a.href = it.out!.url;
      a.download = getOutName(it.file.name, 0, 1);
      a.click();
    } else {
      setMsg('ZIP-Datei wird erstellt …');
      try {
        const zip = new JSZip();
        // keep track of names to prevent duplicates in ZIP
        const usedNames = new Set<string>();
        
        done.forEach((it, i) => {
          let name = getOutName(it.file.name, i, done.length);
          // ensure unique names in zip
          if (usedNames.has(name)) {
             const parts = name.split('.jpg');
             name = `${parts[0]}-${i+1}.jpg`;
          }
          usedNames.add(name);
          zip.file(name, it.out!.blob);
        });
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(zipBlob);
        a.download = 'DateiWerk-Bilder.zip';
        a.click();
        
        setTimeout(() => URL.revokeObjectURL(a.href), 5000);
        setMsg('');
      } catch {
        setMsg('Fehler beim Erstellen der ZIP-Datei.');
      }
    }
  };

  // formatting
  const fmt = (b: number) => {
    const nf = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 });
    return b < 1024 ? b + ' B' : b < 1048576 ? nf.format(b / 1024) + ' KB' : nf.format(b / 1048576) + ' MB';
  };

  const doneItems = items.filter((i) => i.status === 'done');
  const pendingItems = items.filter((i) => i.status !== 'done');
  const sumIn = doneItems.reduce((s, i) => s + i.file.size, 0);
  const sumOut = doneItems.reduce((s, i) => s + (i.out?.size || 0), 0);
  const p = sumIn ? Math.round((1 - sumOut / sumIn) * 100) : 0;

  return (
    <section className="tool" id="tool" aria-label="PNG in JPG Converter">
      <label
        className={`dz ${items.length > 0 ? 'mini' : ''} ${isOver ? 'over' : ''}`}
        id="dz"
        onDragEnter={(e) => { e.preventDefault(); setIsOver(true); }}
        onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsOver(false); }}
        onDrop={(e) => { e.preventDefault(); setIsOver(false); addFiles(e.dataTransfer.files); }}
      >
        <span className="ic"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 16V4m-5 5 5-5 5 5M5 20h14"/></svg></span>
        <strong>PNG-Bilder hier ablegen</strong>
        <small>oder auswählen · mehrere Dateien möglich</small>
        <span className="btn p">{items.length > 0 ? 'Weitere Bilder hinzufügen' : 'Bilder auswählen'}</span>
        <input className="sr" ref={fileInputRef} type="file" accept=".png,image/png" multiple onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
      </label>

      {msg && <p className="msg" role="alert">{msg}</p>}

      <div id="panel" hidden={items.length === 0}>
        <div className="opts">
          <div className="opt">
            <h2>Hintergrundfarbe</h2>
            <p>JPG kennt keine Transparenz. Transparente Bereiche werden mit dieser Farbe gefüllt.</p>
            <div className="sws" role="radiogroup" aria-label="Hintergrundfarbe">
              <label className="sw">
                <input type="radio" name="bg" value="#ffffff" checked={!useCustomBg && bg === '#ffffff'} onChange={() => { setUseCustomBg(false); setBg('#ffffff'); resetResults(); }} />
                <span><i className="dot" style={{ background: '#fff' }}></i>Weiß</span>
              </label>
              <label className="sw">
                <input type="radio" name="bg" value="#000000" checked={!useCustomBg && bg === '#000000'} onChange={() => { setUseCustomBg(false); setBg('#000000'); resetResults(); }} />
                <span><i className="dot" style={{ background: '#000' }}></i>Schwarz</span>
              </label>
              <div className="sw" onClick={() => { setUseCustomBg(true); resetResults(); }} style={{ cursor: 'pointer' }}>
                <input type="radio" name="bg" value="custom" checked={useCustomBg} readOnly style={{ pointerEvents: 'none' }} />
                <span>
                  <input type="color" id="cc" value={customBg} aria-label="Eigene Farbe wählen" onClick={(e) => { e.stopPropagation(); setUseCustomBg(true); }} onChange={(e) => { setUseCustomBg(true); setCustomBg(e.target.value); resetResults(); }} />
                  Farbe wählen
                </span>
              </div>
            </div>
          </div>
          <div className="opt">
            <h2>Qualität</h2>
            <p>Höhere Qualität bedeutet eine größere Datei. 90 % ist meist ein guter Wert.</p>
            <div className="range">
              <input type="range" id="q" min="50" max="100" step="5" value={quality} aria-label="JPG-Qualität" onChange={(e) => { setQuality(+e.target.value); resetResults(); }} />
              <output id="qv" htmlFor="q" className="tn">{quality} %</output>
            </div>
            {doneItems.length > 0 && !pendingItems.length && (
              <div style={{ marginTop: '12px', padding: '10px 12px', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
                Ergebnis: {fmt(sumIn)} → {fmt(sumOut)} {p > 0 && `(−${p} %)`}
              </div>
            )}
          </div>
        </div>

        <details className="adv" style={{ marginTop: '20px', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
          <summary style={{ fontWeight: 600, cursor: 'pointer', outline: 'none', color: 'var(--muted)' }}>Erweiterte Optionen (Dateiname)</summary>
          <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '6px' }}>Namensregel</label>
              <select 
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--line)', background: '#fff', fontSize: '0.9375rem', color: 'var(--text)' }}
                value={nameRule} 
                onChange={(e) => { setNameRule(e.target.value); }}
              >
                <option value="standard">Standard (wie Original)</option>
                <option value="lowercase">Kleinbuchstaben (mein foto.jpg)</option>
                <option value="slug">URL-freundlich (mein-foto.jpg)</option>
                <option value="underscore">Unterstriche (mein_foto.jpg)</option>
                <option value="custom">Manueller Name ...</option>
              </select>
            </div>
            {nameRule === 'custom' && (
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '6px' }}>Eigener Dateiname</label>
                <input 
                  type="text" 
                  value={customName} 
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="z. B. urlaubsbild"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--line)', background: '#fff', fontSize: '0.9375rem', color: 'var(--text)' }}
                />
              </div>
            )}
          </div>
        </details>

        <ul className="list" id="list" aria-live="polite">
          {items.map((it) => (
            <li key={it.id} className={`row ${it.status === 'done' ? 'done' : ''} ${it.status === 'error' ? 'fail' : ''}`}>
              <div className="thumb"><img src={it.url} alt="" /></div>
              <div style={{ minWidth: 0 }}>
                <div className="name">
                  {it.status === 'done' ? getOutName(it.file.name, doneItems.findIndex(d => d.id === it.id), doneItems.length) : it.file.name}
                </div>
                <div className="meta">
                  <span className="tn">{fmt(it.file.size)}</span>
                  {it.status === 'busy' && <><span className="spin" aria-hidden="true"></span><span>Wird umgewandelt …</span></>}
                  {it.status === 'error' && <span style={{ color: 'var(--err)' }}>Umwandlung fehlgeschlagen</span>}
                  {it.status === 'done' && it.out && (
                    <>
                      <span aria-hidden="true">→</span><span className="tn"><b>{fmt(it.out.size)}</b></span>
                      {Math.round((1 - it.out.size / it.file.size) * 100) > 0 ? (
                        <span className="chip tn">−{Math.round((1 - it.out.size / it.file.size) * 100)} %</span>
                      ) : (
                        <span className="chip up tn">+{Math.round((it.out.size / it.file.size - 1) * 100)} %</span>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="act">
                {it.status === 'done' && it.out && (
                  <a className="dl" href={it.out.url} download={getOutName(it.file.name, doneItems.findIndex(d => d.id === it.id), doneItems.length)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11m-5-4 5 5 5-5M5 20h14"/></svg>
                    <span>Herunterladen</span>
                  </a>
                )}
                <button className="rm" type="button" onClick={() => removeFile(it.id)} aria-label={`${it.file.name} entfernen`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="tool-bar">
          <button className="btn s" type="button" onClick={removeAll}>Alle entfernen</button>
          <div className="grow">
            {doneItems.length > 1 && (
              <button className="btn s" type="button" onClick={dlAll}>Als ZIP herunterladen</button>
            )}
            <button className="btn p" type="button" onClick={handleConvert} disabled={busy || pendingItems.length === 0}>
              {busy ? 'Wird umgewandelt …' : `In ${items.length > 1 ? 'JPGs' : 'JPG'} umwandeln`}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
