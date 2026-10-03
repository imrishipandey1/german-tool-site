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

export default function JpgConverter() {
  const [items, setItems] = useState<FileItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  // Settings
  const [pngType, setPngType] = useState('png'); // 'png' | 'png8'
  const [background, setBackground] = useState('white'); // 'white' | 'transparent'
  const [sizeMode, setSizeMode] = useState('');
  const [customWidth, setCustomWidth] = useState('');
  const [suffix, setSuffix] = useState('');
  const [stripExif, setStripExif] = useState(true);
  const [interlaced, setInterlaced] = useState(false);

  const uidRef = useRef(0);
  const dzRef = useRef<HTMLLabelElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetResults = () => {
    if (busy) return;
    setItems(prev => prev.map(i => {
      if (i.out) URL.revokeObjectURL(i.out.url);
      return { ...i, out: undefined, status: 'ready' };
    }));
  };

  const handleAddFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newItems: FileItem[] = [];
    const bad: string[] = [];
    
    Array.from(files).forEach(f => {
      if (f.type !== 'image/jpeg' && !/\.jpe?g$/i.test(f.name)) {
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
      setMsg(`Übersprungen (nur JPG-Dateien): ${bad.slice(0, 3).join(', ')}${bad.length > 3 ? ` und ${bad.length - 3} weitere` : ''}`);
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
    return name.replace(/\.jpe?g$/i, '') + suffix + '.png';
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

        if (background === 'white') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
        }
        
        ctx.drawImage(img, 0, 0, w, h);
        
        cvs.toBlob(b => {
          if (b) resolve(b);
          else reject('Blob failed');
        }, 'image/png');
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
    a.download = 'DateiWerk-Bilder.zip';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const fmt = (b: number) => {
    const nf = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 });
    return b < 1024 ? b + ' B' : b < 1048576 ? nf.format(b / 1024) + ' KB' : nf.format(b / 1048576) + ' MB';
  };

  const doneItems = items.filter(i => i.status === 'done' && i.out);
  const pendingItems = items.filter(i => i.status !== 'done');
  const allSize = items.reduce((s, i) => s + i.file.size, 0);
  const doneInSize = doneItems.reduce((s, i) => s + i.file.size, 0);
  const doneOutSize = doneItems.reduce((s, i) => s + (i.out?.size || 0), 0);
  const saving = doneInSize > 0 ? Math.round((1 - doneOutSize / doneInSize) * 100) : 0;

  return (
    <div className="converter">

      {/* LEFT */}
      <section className="upload-card" aria-label="JPG in PNG Converter">
        <div className="upload-head">
          <h2>Bilder konvertieren</h2>
          <div className="format-switch" aria-label="Zielformat">
            <span>JPG</span>
            <span aria-hidden="true">→</span>
            <strong>PNG</strong>
          </div>
        </div>

        <div className="upload-body">
          <label 
            className="dropzone" 
            ref={dzRef}
            onDragOver={e => { e.preventDefault(); dzRef.current?.classList.add('over'); }}
            onDragLeave={() => dzRef.current?.classList.remove('over')}
            onDrop={e => { e.preventDefault(); dzRef.current?.classList.remove('over'); handleAddFiles(e.dataTransfer.files); }}
            style={items.length > 0 ? { display: 'none' } : {}}
          >
            <span className="drop-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m7 8 5-5 5 5"/><path d="M5 21h14"/><path d="M5 17v2a2 2 0 0 0 2 2"/><path d="M19 17v2a2 2 0 0 1-2 2"/></svg>
            </span>
            <strong>JPG-Bilder auswählen</strong>
            <p>Dateien hierher ziehen oder auf dieses Feld klicken</p>
            <span className="select-button">JPG-Dateien auswählen</span>
            <span className="drop-formats" aria-hidden="true"><span>JPG</span><b>→</b><span>PNG</span></span>
            <input className="sr" type="file" accept=".jpg,.jpeg,image/jpeg" multiple ref={fileInputRef} onChange={e => { handleAddFiles(e.target.files); e.target.value = ''; }} />
          </label>

          {msg && <p style={{color:'var(--err)',marginTop:items.length===0?'16px':'0'}}>{msg}</p>}

          <div className="files" hidden={items.length === 0}>
            <div className="file-header">
              <h3>Ausgewählte Dateien <span className="tn">· {items.length}</span></h3>
              <button className="clear" type="button" onClick={removeAll}>Alle entfernen</button>
            </div>
            
            <ul className="file-list" aria-live="polite">
              {items.map(it => {
                let p = 0;
                if (it.out) p = Math.round((1 - it.out.size / it.file.size) * 100);
                return (
                  <li key={it.id} className={`file-row ${it.status === 'done' ? 'done' : ''} ${it.status === 'error' ? 'fail' : ''}`}>
                    <div className="file-thumb"><img src={it.url} alt="" /></div>
                    <div className="file-name-col" style={{minWidth:0}}>
                      <div className="file-name">{it.file.name}</div>
                      <div className="file-meta">
                        <span className="type">JPG</span>
                        <span className="tn">{fmt(it.file.size)}</span>
                        {it.status === 'busy' && <span>Wird umgewandelt …</span>}
                        {it.status === 'error' && <span style={{color:'var(--err)'}}>Fehlgeschlagen</span>}
                        {it.status === 'done' && it.out && (
                          <>
                            <span aria-hidden="true">→</span>
                            <span className="type png">PNG</span>
                            <b className="tn">{fmt(it.out.size)}</b>
                            {p > 0 ? <span className="tn">−{p} %</span> : <span className="tn">+{Math.abs(p)} %</span>}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="file-actions">
                      {it.status === 'done' && it.out && (
                        <a className="download" href={it.out.url} download={getOutName(it.file.name)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11m-5-4 5 5 5-5M5 20h14"/></svg>
                          <span>Laden</span>
                        </a>
                      )}
                      {it.status !== 'done' && (
                        <button className="remove" type="button" onClick={() => removeItem(it.id)} aria-label="Entfernen">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            <label className="select-button" style={{width:'100%',justifyContent:'center',marginTop:'12px',height:'44px'}}>
              Weitere JPG-Dateien hinzufügen
              <input className="sr" type="file" accept=".jpg,.jpeg,image/jpeg" multiple onChange={e => { handleAddFiles(e.target.files); e.target.value = ''; }} />
            </label>

            <div className="action-area">
              <div className="progress" hidden={!busy}>
                <i style={{ width: `${items.length ? (doneItems.length / items.length) * 100 : 0}%` }}></i>
              </div>

              {doneItems.length > 0 && pendingItems.length === 0 && (
                <div className="result tn">
                  {doneItems.length} {doneItems.length > 1 ? 'Dateien' : 'Datei'} fertig · {fmt(doneInSize)} → {fmt(doneOutSize)}
                </div>
              )}

              <div className="action-buttons">
                {doneItems.length > 1 && (
                  <button className="secondary-button" type="button" onClick={dlAll}>Alle als ZIP laden</button>
                )}
                <button 
                  className="primary-button" 
                  type="button" 
                  onClick={runConvert} 
                  disabled={busy || pendingItems.length === 0}
                  style={doneItems.length <= 1 ? { gridColumn: '1 / -1' } : {}}
                >
                  {busy ? 'Wird umgewandelt …' : 'In PNG umwandeln'}
                </button>
              </div>
            </div>
          </div>

          <p className="privacy">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
            Ihre Bilder werden nicht hochgeladen. Die Verarbeitung erfolgt auf Ihrem Gerät.
          </p>
        </div>
      </section>

      {/* RIGHT SETTINGS */}
      <aside className="settings">
        <div className="settings-title">PNG-Einstellungen</div>
        <div className="settings-body">

          <div className="setting">
            <h3>PNG-Variante</h3>
            <div className="option-grid">
              <div className="option">
                <input type="radio" name="pngtype" id="png24" value="png" checked={pngType === 'png'} onChange={() => { setPngType('png'); resetResults(); }} />
                <label htmlFor="png24"><strong>PNG</strong><small>Volle Farbdarstellung</small></label>
              </div>
              <div className="option">
                <input type="radio" name="pngtype" id="png8" value="png8" checked={pngType === 'png8'} onChange={() => { setPngType('png8'); resetResults(); }} />
                <label htmlFor="png8"><strong>PNG-8</strong><small>Kleinere Dateien</small></label>
              </div>
            </div>
            <p className="setting-description">PNG verwendet eine verlustfreie Kompression. PNG-8 kann die Dateigröße bei Bildern mit wenigen Farben reduzieren.</p>
          </div>

          <div className="setting">
            <h3>Hintergrund</h3>
            <div className="transparency">
              <label><input type="radio" name="background" value="white" checked={background === 'white'} onChange={() => { setBackground('white'); resetResults(); }} /> Weiß</label>
              <label><input type="radio" name="background" value="transparent" checked={background === 'transparent'} onChange={() => { setBackground('transparent'); resetResults(); }} /> Transparent</label>
            </div>
          </div>

          <div className="setting">
            <h3>Bildgröße</h3>
            <select value={sizeMode} onChange={e => { setSizeMode(e.target.value); resetResults(); }}>
              <option value="">Originalgröße beibehalten</option>
              <option value="3840">Max. 3840 px (4K)</option>
              <option value="1920">Max. 1920 px (Full HD)</option>
              <option value="1280">Max. 1280 px</option>
              <option value="800">Max. 800 px</option>
              <option value="custom">Eigene Breite …</option>
            </select>
            {sizeMode === 'custom' && (
              <input className="number" type="number" min="16" max="10000" placeholder="Breite in Pixel" value={customWidth} onChange={e => { setCustomWidth(e.target.value); resetResults(); }} />
            )}
            <p className="setting-description">Das Seitenverhältnis bleibt erhalten. Kleine Bilder werden nicht automatisch vergrößert.</p>
          </div>

          <div className="setting">
            <h3>Dateiname</h3>
            <select value={suffix} onChange={e => { setSuffix(e.target.value); resetResults(); }}>
              <option value="">bild.png</option>
              <option value="-konvertiert">bild-konvertiert.png</option>
              <option value="-png">bild-png.png</option>
            </select>
          </div>

          <div className="setting" style={{display:'grid',gap:'16px'}}>
            <div className="switch">
              <label htmlFor="metadata">Metadaten entfernen<small>Entfernt eingebettete Kamera- und Standortinformationen.</small></label>
              <input type="checkbox" id="metadata" role="switch" checked={stripExif} onChange={e => { setStripExif(e.target.checked); resetResults(); }} />
            </div>
            <div className="switch">
              <label htmlFor="interlace">Interlaced PNG<small>Ermöglicht eine schrittweise Darstellung beim Laden.</small></label>
              <input type="checkbox" id="interlace" role="switch" checked={interlaced} onChange={e => { setInterlaced(e.target.checked); resetResults(); }} />
            </div>
          </div>

          <div className="info">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01"/><path d="M11 12h1v5h1"/></svg>
            <span>Die Konvertierung von JPG zu PNG stellt die bereits verlorenen Bildinformationen nicht wieder her. Das PNG wird jedoch ohne zusätzliche verlustbehaftete Kompression gespeichert.</span>
          </div>

          <button className="reset" type="button" onClick={() => {
            setPngType('png');
            setBackground('white');
            setSizeMode('');
            setCustomWidth('');
            setSuffix('');
            setStripExif(true);
            setInterlaced(false);
            resetResults();
          }}>Einstellungen zurücksetzen</button>

        </div>
      </aside>

    </div>
  );
}
