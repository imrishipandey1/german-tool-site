"use client";
import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';

type FileItem = {
  id: number;
  file: File;
  status: 'ready' | 'busy' | 'done' | 'error';
  previewUrl?: string;
  out?: { blob: Blob; size: number; url: string };
};

export default function HeicConverter() {
  const [items, setItems] = useState<FileItem[]>([]);
  const [isOver, setIsOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  
  const [quality, setQuality] = useState(0.9);
  const [ext, setExt] = useState('jpg');
  const [removeLocation, setRemoveLocation] = useState(true);

  const uidRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load heic2any dynamically to avoid SSR issues if necessary, but it's safe inside event handlers.

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
      if (!/\.(heic|heif)$/i.test(f.name) && !/^image\/hei[cf]/.test(f.type)) {
        bad.push(f.name);
        return;
      }
      uidRef.current++;
      const currentId = uidRef.current;
      newItems.push({ id: currentId, file: f, status: 'ready' });
      
      // Async generate thumbnail
      import('heic2any').then(({ default: heic2any }) => {
        heic2any({ blob: f, toType: 'image/jpeg', quality: 0.1 }).then(res => {
          const blob = Array.isArray(res) ? res[0] : res;
          setItems(prev => prev.map(i => i.id === currentId ? { ...i, previewUrl: URL.createObjectURL(blob) } : i));
        }).catch(() => {});
      });
      added++;
    });
    
    if (bad.length > 0) {
      const bStr = bad.slice(0, 3).join(', ') + (bad.length > 3 ? ' und ' + (bad.length - 3) + ' weitere' : '');
      setMsg('Übersprungen (nur HEIC-Dateien): ' + bStr + limitMsg);
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
      if (item) { if (item.out) URL.revokeObjectURL(item.out.url); if (item.previewUrl) URL.revokeObjectURL(item.previewUrl); }
      return prev.filter((i) => i.id !== id);
    });
  };

  const removeAll = () => {
    if (busy) return;
    items.forEach((i) => {
      if (i.out) URL.revokeObjectURL(i.out.url); if (i.previewUrl) URL.revokeObjectURL(i.previewUrl);
    });
    setItems([]);
    setMsg('');
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
        const heic2any = (await import('heic2any')).default;
        const result = await heic2any({
          blob: item.file,
          toType: 'image/jpeg',
          quality: quality
        });
        
        const blob = Array.isArray(result) ? result[0] : result;
        setItems((prev) =>
          prev.map((i) => {
            if (i.id === id) {
              return { ...i, status: 'done', out: { blob, size: blob.size, url: URL.createObjectURL(blob) } };
            }
            return i;
          })
        );
      } catch (err) {
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'error' } : i)));
      }
    }
    setBusy(false);
  };

  const getOutName = (orig: string) => {
    return orig.replace(/\.(heic|heif)$/i, '') + '.' + ext;
  };

  const dlAll = async () => {
    const done = items.filter((i) => i.status === 'done' && i.out);
    if (done.length === 0) return;
    
    if (done.length === 1) {
      const it = done[0];
      const a = document.createElement('a');
      a.href = it.out!.url;
      a.download = getOutName(it.file.name);
      a.click();
    } else {
      setMsg('ZIP-Datei wird erstellt …');
      try {
        const zip = new JSZip();
        const usedNames = new Set<string>();
        
        done.forEach((it, i) => {
          let name = getOutName(it.file.name);
          if (usedNames.has(name)) {
             const parts = name.split('.' + ext);
             name = `${parts[0]}-${i+1}.${ext}`;
          }
          usedNames.add(name);
          zip.file(name, it.out!.blob);
        });
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(zipBlob);
        a.download = 'ZappTool-Bilder.zip';
        a.click();
        
        setTimeout(() => URL.revokeObjectURL(a.href), 5000);
        setMsg('');
      } catch {
        setMsg('Fehler beim Erstellen der ZIP-Datei.');
      }
    }
  };

  const fmt = (b: number) => {
    const nf = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 });
    return b < 1024 ? b + ' B' : b < 1048576 ? nf.format(b / 1024) + ' KB' : nf.format(b / 1048576) + ' MB';
  };

  const doneItems = items.filter((i) => i.status === 'done');
  const pendingItems = items.filter((i) => i.status !== 'done');
  const sumIn = doneItems.reduce((s, i) => s + i.file.size, 0);
  const sumOut = doneItems.reduce((s, i) => s + (i.out?.size || 0), 0);

  return (
    <section className="tool" id="tool" data-step={items.length === 0 ? '1' : (doneItems.length && !pendingItems.length ? '3' : '2')} aria-label="HEIC in JPG Converter">
      <ol className="stepper" aria-hidden="true"><li>Auswählen</li><li>Einstellen</li><li>Herunterladen</li></ol>

      <div className="body">
        <label
          className={`dz ${items.length > 0 ? 'mini' : ''} ${isOver ? 'over' : ''}`}
          id="dz"
          onDragEnter={(e) => { e.preventDefault(); setIsOver(true); }}
          onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsOver(false); }}
          onDrop={(e) => { e.preventDefault(); setIsOver(false); addFiles(e.dataTransfer.files); }}
        >
          <span className="ic"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2M12 14V8m-2.5 2.5L12 8l2.5 2.5"/></svg></span>
          <strong>HEIC-Fotos hierher ziehen</strong>
          <small>Dateien der Endung .heic oder .heif, mehrere gleichzeitig möglich</small>
          <span className="btn p">{items.length > 0 ? 'Weitere Fotos hinzufügen' : 'Fotos auswählen'}</span>
          <input className="sr" ref={fileInputRef} type="file" accept=".heic,.heif,image/heic,image/heif" multiple onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
        </label>

        {msg && <p className="msg" role="alert">{msg}</p>}

        <div id="panel" hidden={items.length === 0}>
          <div className="set">
            <div className="srow" style={{ display: 'grid', gap: '10px', padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
              <div><h2 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700 }}>Qualität</h2><p style={{ margin: '2px 0 0', color: 'var(--muted)', fontSize: '0.8125rem' }}>Höhere Qualität erzeugt größere Dateien.</p></div>
              <div className="seg" role="radiogroup" aria-label="Qualität">
                <label><input type="radio" name="qual" value="0.75" checked={quality === 0.75} onChange={() => { setQuality(0.75); resetResults(); }} /><span>Klein</span></label>
                <label><input type="radio" name="qual" value="0.9" checked={quality === 0.9} onChange={() => { setQuality(0.9); resetResults(); }} /><span>Ausgewogen</span></label>
                <label><input type="radio" name="qual" value="0.97" checked={quality === 0.97} onChange={() => { setQuality(0.97); resetResults(); }} /><span>Beste</span></label>
              </div>
            </div>
            <div className="srow" style={{ display: 'grid', gap: '10px', padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
              <div><h2 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700 }}>Dateiendung</h2><p style={{ margin: '2px 0 0', color: 'var(--muted)', fontSize: '0.8125rem' }}>Beide Endungen sind dasselbe Format.</p></div>
              <div className="seg" role="radiogroup" aria-label="Dateiendung">
                <label><input type="radio" name="ext" value="jpg" checked={ext === 'jpg'} onChange={() => { setExt('jpg'); resetResults(); }} /><span>.jpg</span></label>
                <label><input type="radio" name="ext" value="jpeg" checked={ext === 'jpeg'} onChange={() => { setExt('jpeg'); resetResults(); }} /><span>.jpeg</span></label>
              </div>
            </div>
            <div className="srow" style={{ padding: '14px 16px' }}>
              <div className="tg">
                <div><h2 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700 }}>Standortdaten entfernen</h2><p style={{ margin: '2px 0 0', color: 'var(--muted)', fontSize: '0.8125rem' }}>Löscht GPS-Koordinaten aus den Foto-Informationen (EXIF).</p></div>
                <label className="sw"><input type="checkbox" checked={removeLocation} onChange={(e) => { setRemoveLocation(e.target.checked); resetResults(); }} role="switch" aria-label="Standortdaten entfernen" /><i></i></label>
              </div>
            </div>
          </div>

          <ul className="list" id="list" aria-live="polite">
            {items.map((it) => (
              <li key={it.id} className={`row ${it.status === 'done' ? 'done' : ''} ${it.status === 'error' ? 'fail' : ''}`}>
                <div className="thumb">
                  {it.status === 'done' && it.out ? (
                    <img src={it.out.url} alt="" />
                  ) : it.previewUrl ? (
                    <img src={it.previewUrl} alt="" />
                  ) : (
                    'HEIC'
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="name">
                    {it.status === 'done' ? getOutName(it.file.name) : it.file.name}
                  </div>
                  <div className="meta">
                    <span className="tn">{fmt(it.file.size)}</span>
                    {it.status === 'busy' && <><span className="spin" aria-hidden="true"></span><span>Wird umgewandelt …</span></>}
                    {it.status === 'error' && <span style={{ color: 'var(--err)' }}>Fehlgeschlagen</span>}
                    {it.status === 'done' && it.out && (
                      <><span aria-hidden="true">→</span><span className="tn ok">{fmt(it.out.size)} JPG</span></>
                    )}
                  </div>
                </div>
                <div className="act">
                  {it.status === 'done' && it.out && (
                    <a className="dl" href={it.out.url} download={getOutName(it.file.name)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11m-5-4 5 5 5-5M5 20h14"/></svg>
                      <span>Herunterladen</span>
                    </a>
                  )}
                  <button className="rm" type="button" onClick={() => removeFile(it.id)} aria-label={`${it.file.name} entfernen`}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {doneItems.length > 0 && !pendingItems.length && (
            <div className="sum tn" id="sum">
              {doneItems.length} {doneItems.length > 1 ? 'Fotos' : 'Foto'} umgewandelt · Gesamtgröße {fmt(sumOut)}
            </div>
          )}

          <div className="tool-bar">
            <button className="btn s" type="button" onClick={removeAll}>Alle entfernen</button>
            <div className="grow">
              {doneItems.length > 1 && (
                <button className="btn s" type="button" onClick={dlAll}>Alle herunterladen</button>
              )}
              <button className="btn p" type="button" onClick={handleConvert} disabled={busy || pendingItems.length === 0}>
                {busy ? 'Wird umgewandelt …' : `In ${items.length > 1 ? 'JPGs' : 'JPG'} umwandeln`}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <p className="priv">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 5 6v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>
        Ihre Fotos werden nicht hochgeladen. Die Umwandlung passiert auf Ihrem Gerät.
      </p>
    </section>
  );
}
