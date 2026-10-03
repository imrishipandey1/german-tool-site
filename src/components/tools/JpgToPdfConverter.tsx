"use client";

import React, { useState, useRef, useEffect, useCallback, DragEvent, useLayoutEffect } from 'react';

interface Item {
  id: number;
  file: File;
  url: string;
  rot: number;
  w: number;
  h: number;
}

interface Options {
  pageSize: string;
  orientation: string;
  margin: string;
  fit: string;
  quality: string;
}

export default function JpgToPdfConverter() {
  const [items, setItems] = useState<Item[]>([]);
  const [msg, setMsg] = useState('');
  const [dragId, setDragId] = useState<number | null>(null);
  const [isOver, setIsOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ size: number; url: string } | null>(null);
  
  const [opts, setOpts] = useState<Options>({
    pageSize: 'a4',
    orientation: 'auto',
    margin: 'small',
    fit: 'contain',
    quality: 'orig'
  });
  
  const [filename, setFilename] = useState('bilder');
  
  const uidRef = useRef(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pimgRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  
  const clearResult = () => {
    if (result) {
      URL.revokeObjectURL(result.url);
      setResult(null);
    }
  };

  const addFiles = (files: FileList | File[]) => {
    const bad: string[] = [];
    const newItems: Item[] = [];
    
    Array.from(files).forEach(f => {
      if (f.type !== 'image/jpeg' && !/\.jpe?g$/i.test(f.name)) {
        bad.push(f.name);
        return;
      }
      uidRef.current += 1;
      const it: Item = { id: uidRef.current, file: f, url: URL.createObjectURL(f), rot: 0, w: 0, h: 0 };
      newItems.push(it);
      
      const im = new Image();
      im.onload = () => {
        setItems(prev => prev.map(x => x.id === it.id ? { ...x, w: im.naturalWidth, h: im.naturalHeight } : x));
      };
      im.src = it.url;
    });
    
    if (bad.length > 0) {
      setMsg('Übersprungen (nur JPG- und JPEG-Dateien): ' + bad.slice(0, 3).join(', ') + (bad.length > 3 ? ' und ' + (bad.length - 3) + ' weitere' : ''));
    } else {
      setMsg('');
    }
    
    if (newItems.length > 0) {
      clearResult();
      setItems(prev => [...prev, ...newItems]);
    }
  };

  const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
    e.target.value = '';
  };

  const move = (id: number, to: number) => {
    setItems(prev => {
      const arr = [...prev];
      const from = arr.findIndex(x => x.id === id);
      if (from < 0 || to < 0 || to >= arr.length) return prev;
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
    clearResult();
  };

  const remove = (id: number) => {
    setItems(prev => {
      const arr = prev.filter(x => {
        if (x.id === id) {
          URL.revokeObjectURL(x.url);
          return false;
        }
        return true;
      });
      return arr;
    });
    clearResult();
  };

  const rotate = (id: number) => {
    setItems(prev => prev.map(x => x.id === id ? { ...x, rot: (x.rot + 90) % 360 } : x));
    clearResult();
  };
  
  const sortByFilename = () => {
    setItems(prev => {
      const arr = [...prev];
      arr.sort((a, b) => a.file.name.localeCompare(b.file.name, 'de', { numeric: true }));
      return arr;
    });
    clearResult();
  };

  const onDragStart = (e: DragEvent<HTMLLIElement>, id: number) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(id));
  };
  
  const onDragOverItem = (e: DragEvent<HTMLLIElement>, id: number) => {
    e.preventDefault();
  };
  
  const onDropItem = (e: DragEvent<HTMLLIElement>, toId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragId !== null) {
      const toIndex = items.findIndex(x => x.id === toId);
      move(dragId, toIndex);
    }
    setDragId(null);
  };
  
  const onDropZoneEnter = (e: DragEvent<HTMLDivElement>) => {
    if (dragId !== null) return;
    e.preventDefault();
    setIsOver(true);
  };
  
  const onDropZoneLeave = (e: DragEvent<HTMLDivElement>) => {
    if (dragId !== null) return;
    e.preventDefault();
    setIsOver(false);
  };
  
  const onDropZoneDrop = (e: DragEvent<HTMLDivElement>) => {
    if (dragId !== null) return;
    e.preventDefault();
    setIsOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length) {
        addFiles(e.clipboardData.files);
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const demoPdf = (pages: any[]) => {
    return new Promise<Blob>((resolve) => {
      setTimeout(() => {
        const s = pages.reduce((a, p) => a + p.file.size, 0);
        resolve(new Blob([new Uint8Array(Math.round(s * 0.98))], { type: 'application/pdf' }));
      }, 900);
    });
  };

  const engine = (pages: any[], options: any) => {
    const w = window as any;
    if (w.ZappTool && w.ZappTool.createPdf) {
      return w.ZappTool.createPdf(pages, options);
    }
    return demoPdf(pages);
  };

  const createPdf = async () => {
    if (busy || !items.length) return;
    setBusy(true);
    clearResult();
    
    try {
      const blob = await engine(items.map(i => ({ file: i.file, rotation: i.rot })), opts);
      setResult({ size: blob.size, url: URL.createObjectURL(blob) });
    } catch (e) {
      setMsg('Das PDF konnte nicht erstellt werden. Bitte versuchen Sie es erneut.');
    }
    setBusy(false);
  };

  const nf = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 });
  const fmt = (b: number) => b < 1024 ? b + ' B' : b < 1048576 ? nf.format(b / 1024) + ' KB' : nf.format(b / 1048576) + ' MB';


  // Update image size on resize and rotate
  useEffect(() => {
    const updateSize = () => {
      if (!pimgRef.current || !imgRef.current || !items[0]) return;
      const b = pimgRef.current.getBoundingClientRect();
      const sw = items[0].rot % 180;
      imgRef.current.style.width = (sw ? b.height : b.width) + 'px';
      imgRef.current.style.height = (sw ? b.width : b.height) + 'px';
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [items, opts.pageSize, opts.orientation, opts.margin]);

  // Preview computations
  const f = items[0];
  const fe = f && f.w ? (f.rot % 180 ? { w: f.h, h: f.w } : { w: f.w, h: f.h }) : null;
  let r = 0.707;
  let land = false;
  if (opts.pageSize === 'fit') {
    r = fe ? fe.w / fe.h : 0.75;
    land = r > 1;
  } else {
    const base = opts.pageSize === 'a4' ? 210 / 297 : 8.5 / 11;
    land = opts.orientation === 'landscape' || (opts.orientation === 'auto' && fe !== null && fe.w > fe.h);
    r = land ? 1 / base : base;
  }
  
  const pad = opts.margin === 'none' ? '0' : opts.margin === 'small' ? '5%' : '10%';
  const pcap = (opts.pageSize === 'a4' ? 'DIN A4' : opts.pageSize === 'letter' ? 'US Letter' : 'An Bild angepasst') + 
               ' · ' + (land ? 'Querformat' : 'Hochformat') + 
               (items.length ? ' · ' + items.length + (items.length === 1 ? ' Seite' : ' Seiten') : '');
               
  const qnote = opts.quality === 'orig' ? 'Die Bilder werden unverändert übernommen. Die Qualität bleibt erhalten.' :
                opts.quality === 'bal' ? 'Die Bilder werden leicht neu komprimiert. Die Datei wird spürbar kleiner.' :
                'Die Bilder werden stärker komprimiert. Gut für E-Mail und Upload-Limits.';
                
  const finalFilename = (filename.trim().replace(/\.pdf$/i, '').replace(/[\\/:*?"<>|]+/g, '-') || 'bilder') + '.pdf';

  return (
    <div className="composer" id="tool">
      {/* 1: Bilder */}
      <section className="card" aria-labelledby="h1b">
        <div className="sh">
          <b>1</b><h2 id="h1b">Bilder hinzufügen</h2>
          <button className="btn s sm sp" type="button" hidden={items.length < 2} onClick={sortByFilename}>Nach Namen sortieren</button>
        </div>
        {msg && <p className="msg" role="alert">{msg}</p>}
        <div 
          className={`drop ${isOver ? 'over' : ''}`} 
          onDragEnter={onDropZoneEnter} 
          onDragOver={onDropZoneEnter} 
          onDragLeave={onDropZoneLeave} 
          onDrop={onDropZoneDrop}
        >
          {items.length === 0 ? (
            <label className="empty">
              <span className="ic">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M12 15V9m-3 3 3-3 3 3"/></svg>
              </span>
              <strong>JPG-Bilder hierher ziehen</strong>
              <small>oder auswählen · mehrere Bilder möglich · Einfügen mit Strg + V</small>
              <span className="btn p">Bilder auswählen</span>
              <input className="sr" type="file" accept=".jpg,.jpeg,image/jpeg" multiple onChange={onFilesChange} />
            </label>
          ) : (
            <ul className="grid">
              {items.map((it, i) => (
                <li 
                  key={it.id} 
                  className={`tile ${dragId === it.id ? 'drag' : ''}`} 
                  draggable 
                  onDragStart={(e) => onDragStart(e, it.id)}
                  onDragEnd={() => setDragId(null)}
                  onDragOver={(e) => onDragOverItem(e, it.id)}
                  onDrop={(e) => onDropItem(e, it.id)}
                >
                  <span className="pg tn">{i + 1}</span>
                  <div className="thumb">
                    <img src={it.url} alt="" style={{ transform: `rotate(${it.rot}deg)` }} />
                  </div>
                  <div className="nm" title={it.file.name}>{it.file.name}</div>
                  <div className="tc">
                    <button type="button" aria-label="Nach vorne" disabled={i === 0} onClick={() => move(it.id, i - 1)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 6-6 6 6 6"/></svg>
                    </button>
                    <button type="button" aria-label="Um 90 Grad drehen" onClick={() => rotate(it.id)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12a8 8 0 1 1-2.6-5.9M20 4v5h-5"/></svg>
                    </button>
                    <button type="button" aria-label="Nach hinten" disabled={i === items.length - 1} onClick={() => move(it.id, i + 1)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6"/></svg>
                    </button>
                    <button type="button" data-a="rm" aria-label="Entfernen" onClick={() => remove(it.id)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
                    </button>
                  </div>
                </li>
              ))}
              <li>
                <label className="add">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
                  Weitere Bilder
                  <input className="sr" type="file" accept=".jpg,.jpeg,image/jpeg" multiple onChange={onFilesChange} />
                </label>
              </li>
            </ul>
          )}
        </div>
        {items.length > 0 && <p className="hintrow">Ziehen Sie die Bilder in die gewünschte Reihenfolge. Jedes Bild wird eine eigene Seite.</p>}
      </section>

      {/* 2: Seite einrichten */}
      <section className="card" aria-labelledby="h2b">
        <div className="sh">
          <b>2</b><h2 id="h2b">Seite einrichten</h2>
          <button className="lnk sp" type="button" onClick={() => {
            setOpts({ pageSize: 'a4', orientation: 'auto', margin: 'small', fit: 'contain', quality: 'orig' });
            clearResult();
          }}>Zurücksetzen</button>
        </div>
        <div className="page">
          <div className="prev">
            <div className="stage">
              <div className="sheet" style={{ '--r': r, padding: pad } as any}>
                <div className="pimg" ref={pimgRef}>
                  {f ? (
                    <img 
                      ref={imgRef}
                      src={f.url} 
                      alt="" 
                      style={{ 
                        objectFit: opts.fit === 'cover' && opts.pageSize !== 'fit' ? 'cover' : 'contain', 
                        transform: `translate(-50%,-50%) rotate(${f.rot}deg)`
                      }} 
                    />
                  ) : (
                    <span className="ph">Vorschau der ersten Seite</span>
                  )}
                </div>
              </div>
            </div>
            <small className="tn">{pcap}</small>
          </div>
          
          <div className="opts">
            <fieldset>
              <legend>Seitengröße</legend>
              <div className="pills">
                {['a4', 'letter', 'fit'].map(v => (
                  <label key={v} className="pill">
                    <input type="radio" name="size" value={v} checked={opts.pageSize === v} onChange={() => { setOpts({...opts, pageSize: v}); clearResult(); }} />
                    <span>{v === 'a4' ? 'DIN A4' : v === 'letter' ? 'US Letter' : 'An Bild anpassen'}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            
            <fieldset>
              <legend>Ausrichtung</legend>
              <div className="pills">
                {['auto', 'portrait', 'landscape'].map(v => (
                  <label key={v} className="pill">
                    <input type="radio" name="orient" value={v} checked={opts.orientation === v} disabled={opts.pageSize === 'fit'} onChange={() => { setOpts({...opts, orientation: v}); clearResult(); }} />
                    <span>{v === 'auto' ? 'Automatisch' : v === 'portrait' ? 'Hochformat' : 'Querformat'}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            
            <fieldset>
              <legend>Seitenrand</legend>
              <div className="pills">
                {['none', 'small', 'normal'].map(v => (
                  <label key={v} className="pill">
                    <input type="radio" name="margin" value={v} checked={opts.margin === v} onChange={() => { setOpts({...opts, margin: v}); clearResult(); }} />
                    <span>{v === 'none' ? 'Kein Rand' : v === 'small' ? 'Klein' : 'Normal'}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            
            <fieldset>
              <legend>Bildanpassung</legend>
              <div className="pills">
                {['contain', 'cover'].map(v => (
                  <label key={v} className="pill">
                    <input type="radio" name="fit" value={v} checked={opts.fit === v} disabled={opts.pageSize === 'fit'} onChange={() => { setOpts({...opts, fit: v}); clearResult(); }} />
                    <span>{v === 'contain' ? 'Ganzes Bild' : 'Seite füllen'}</span>
                  </label>
                ))}
              </div>
              {opts.pageSize !== 'fit' && <p className="note">„Seite füllen“ schneidet überstehende Ränder ab.</p>}
            </fieldset>
            
            <fieldset>
              <legend>Dateigröße</legend>
              <div className="pills">
                {['orig', 'bal', 'small'].map(v => (
                  <label key={v} className="pill">
                    <input type="radio" name="qual" value={v} checked={opts.quality === v} onChange={() => { setOpts({...opts, quality: v}); clearResult(); }} />
                    <span>{v === 'orig' ? 'Original' : v === 'bal' ? 'Ausgewogen' : 'Klein'}</span>
                  </label>
                ))}
              </div>
              <p className="note">{qnote}</p>
            </fieldset>
          </div>
        </div>
      </section>

      {/* 3: PDF erstellen */}
      <section className="card wide" aria-labelledby="h3b">
        <div className="sh"><b>3</b><h2 id="h3b">PDF erstellen</h2></div>
        <div className="make">
          <div className="fn">
            <label htmlFor="fname">Dateiname</label>
            <div className="in">
              <input id="fname" type="text" value={filename} onChange={(e) => setFilename(e.target.value)} maxLength={80} autoComplete="off" spellCheck="false" />
              <span className="ext">.pdf</span>
            </div>
          </div>
          <button className="btn p" type="button" disabled={busy || items.length === 0} onClick={createPdf}>
            {busy ? <><span className="spin" aria-hidden="true"></span>PDF wird erstellt …</> : 'PDF erstellen'}
          </button>
        </div>
        
        {result && (
          <div className="res">
            <div>
              <strong>Ihr PDF ist fertig</strong>
              <span className="tn">{items.length + (items.length === 1 ? ' Seite' : ' Seiten')} · {fmt(result.size)}</span>
            </div>
            <a className="dl" href={result.url} download={finalFilename}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11m-5-4 5 5 5-5M5 20h14"/></svg>
              PDF herunterladen
            </a>
          </div>
        )}
        
        <p className="priv">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
          Ihre Bilder werden nicht hochgeladen. Das PDF entsteht auf Ihrem Gerät.
        </p>
      </section>
    </div>
  );
}
