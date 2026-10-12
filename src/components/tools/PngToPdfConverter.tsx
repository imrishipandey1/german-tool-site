"use client";

import React, { useState, useRef, useEffect, DragEvent } from 'react';

interface Item {
  id: number;
  file: File;
  url: string;
  rot: number;
  w: number;
  h: number;
}

interface Options {
  pageSize: 'a4' | 'letter' | 'fit';
  orientation: 'auto' | 'portrait' | 'landscape';
  margin: 'none' | 'small' | 'normal';
  fit: 'contain' | 'cover';
  compression: 'lossless' | 'optimized';
  pageNumbers: boolean;
  bgType: 'white' | 'transparent' | 'color';
  bgColor: string;
}

const defaultOptions: Options = {
  pageSize: 'a4',
  orientation: 'auto',
  margin: 'small',
  fit: 'contain',
  compression: 'lossless',
  pageNumbers: false,
  bgType: 'white',
  bgColor: '#e0ecff',
};

export default function PngToPdfConverter() {
  const [items, setItems] = useState<Item[]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ size: number; url: string } | null>(null);
  const [isOver, setIsOver] = useState(false);
  const [dragId, setDragId] = useState<number | null>(null);
  const [dragTargetId, setDragTargetId] = useState<number | null>(null);
  const [filename, setFilename] = useState('bilder');
  const [opts, setOpts] = useState<Options>(defaultOptions);

  const uidRef = useRef(0);
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const nf = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 });
  const fmt = (b: number) =>
    b < 1024 ? b + ' B' : b < 1048576 ? nf.format(b / 1024) + ' KB' : nf.format(b / 1048576) + ' MB';

  const clearResult = () => {
    if (result) {
      URL.revokeObjectURL(result.url);
      setResult(null);
    }
  };

  const addFiles = (files: FileList | File[]) => {
    const bad: string[] = [];
    const newItems: Item[] = [];

    Array.from(files).forEach((f) => {
      if (f.type !== 'image/png' && !/\.png$/i.test(f.name)) {
        bad.push(f.name);
        return;
      }
      uidRef.current += 1;
      const it: Item = {
        id: uidRef.current,
        file: f,
        url: URL.createObjectURL(f),
        rot: 0,
        w: 0,
        h: 0,
      };
      newItems.push(it);

      const im = new Image();
      im.onload = () => {
        setItems((prev) =>
          prev.map((x) => (x.id === it.id ? { ...x, w: im.naturalWidth, h: im.naturalHeight } : x))
        );
      };
      im.src = it.url;
    });

    if (bad.length > 0) {
      setMsg(
        'Übersprungen (nur PNG-Dateien): ' +
          bad.slice(0, 3).join(', ') +
          (bad.length > 3 ? ' und ' + (bad.length - 3) + ' weitere' : '')
      );
    } else {
      setMsg('');
    }

    if (newItems.length > 0) {
      clearResult();
      setItems((prev) => {
        const next = [...prev, ...newItems];
        if (sel === null && next.length > 0) {
          setSel(next[0].id);
        }
        return next;
      });
      if (sel === null) {
        setSel(newItems[0].id);
      }
    }
  };

  const remove = (id: number) => {
    clearResult();
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.id === id);
      if (idx < 0) return prev;
      URL.revokeObjectURL(prev[idx].url);
      const next = prev.filter((x) => x.id !== id);
      if (sel === id) {
        if (next.length === 0) setSel(null);
        else setSel(next[Math.min(idx, next.length - 1)].id);
      }
      return next;
    });
  };

  const removeAll = () => {
    clearResult();
    items.forEach((it) => URL.revokeObjectURL(it.url));
    setItems([]);
    setSel(null);
    setMsg('');
  };

  const sortByName = () => {
    clearResult();
    setItems((prev) => {
      const copy = [...prev];
      copy.sort((a, b) => a.file.name.localeCompare(b.file.name, 'de', { numeric: true }));
      return copy;
    });
  };

  const move = (id: number, to: number) => {
    clearResult();
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.id === id);
      if (idx < 0 || to < 0 || to >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  };

  const rotate = (id: number) => {
    clearResult();
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, rot: (x.rot + 90) % 360 } : x))
    );
  };

  // Drag and drop page items
  const onDragStart = (e: DragEvent<HTMLLIElement>, id: number) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(id));
  };

  const onDragOverItem = (e: DragEvent<HTMLLIElement>, id: number) => {
    e.preventDefault();
    if (dragId !== null && dragId !== id) {
      setDragTargetId(id);
    }
  };

  const onDropItem = (e: DragEvent<HTMLLIElement>, toId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragId !== null) {
      const toIndex = items.findIndex((x) => x.id === toId);
      move(dragId, toIndex);
    }
    setDragId(null);
    setDragTargetId(null);
  };

  const onDragEnd = () => {
    setDragId(null);
    setDragTargetId(null);
  };

  // Drop zone (files)
  const onDropFiles = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  // Global paste support (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length) {
        addFiles(e.clipboardData.files);
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  // Currently selected item index
  const curIdx = items.findIndex((x) => x.id === sel);
  const curItem = curIdx >= 0 ? items[curIdx] : null;

  // Effective dimensions for preview
  const effW = curItem ? (curItem.rot % 180 ? curItem.h : curItem.w) : 0;
  const effH = curItem ? (curItem.rot % 180 ? curItem.w : curItem.h) : 0;

  // Aspect ratio calculation for preview sheet
  let previewRatio = 0.707;
  let isLandscape = false;
  if (curItem) {
    if (opts.pageSize === 'fit') {
      previewRatio = effW && effH ? effW / effH : 0.75;
      isLandscape = previewRatio > 1;
    } else {
      const base = opts.pageSize === 'a4' ? 210 / 297 : 8.5 / 11;
      isLandscape =
        opts.orientation === 'landscape' ||
        (opts.orientation === 'auto' && effW > effH);
      previewRatio = isLandscape ? 1 / base : base;
    }
  }

  const isTransparent =
    opts.bgType === 'transparent' && opts.compression === 'lossless';
  const previewBg = isTransparent
    ? 'var(--chk)'
    : opts.bgType === 'color'
    ? opts.bgColor
    : '#fff';

  const previewPadding =
    opts.margin === 'none' ? '0' : opts.margin === 'small' ? '5%' : '10%';

  const pcapText =
    (opts.pageSize === 'a4'
      ? 'DIN A4'
      : opts.pageSize === 'letter'
      ? 'US Letter'
      : 'An Bild angepasst') +
    ' · ' +
    (isLandscape ? 'Querformat' : 'Hochformat');

  const totalSize = items.reduce((s, i) => s + i.file.size, 0);

  const getCleanFileName = () => {
    const n = filename
      .trim()
      .replace(/\.pdf$/i, '')
      .replace(/[\\/:*?"<>|]+/g, '-');
    return (n || 'bilder') + '.pdf';
  };

  // Create PDF using dynamic jsPDF import
  const createPdf = async () => {
    if (busy || !items.length) return;
    setBusy(true);
    clearResult();

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'mm' });
      doc.deletePage(1);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        // Load image
        const img = new Image();
        img.src = item.url;
        await new Promise((resolve, reject) => {
          img.onload = () => resolve(true);
          img.onerror = () => reject(new Error('Bild konnte nicht geladen werden'));
        });

        const isRot = item.rot === 90 || item.rot === 270;
        const itemEffW = isRot ? img.naturalHeight : img.naturalWidth;
        const itemEffH = isRot ? img.naturalWidth : img.naturalHeight;

        // Render rotated image to offscreen canvas
        const cvs = document.createElement('canvas');
        cvs.width = itemEffW;
        cvs.height = itemEffH;
        const ctx = cvs.getContext('2d');
        if (!ctx) throw new Error('Canvas context not available');

        // Handle background color for canvas if optimized or non-transparent
        if (opts.bgType !== 'transparent' || opts.compression === 'optimized') {
          ctx.fillStyle = opts.bgType === 'color' ? opts.bgColor : '#ffffff';
          ctx.fillRect(0, 0, itemEffW, itemEffH);
        }

        ctx.translate(itemEffW / 2, itemEffH / 2);
        ctx.rotate((item.rot * Math.PI) / 180);
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

        // Compress
        let imgData: string;
        let imgFormat: 'PNG' | 'JPEG';
        if (opts.compression === 'optimized') {
          imgData = cvs.toDataURL('image/jpeg', 0.86);
          imgFormat = 'JPEG';
        } else {
          imgData = cvs.toDataURL('image/png');
          imgFormat = 'PNG';
        }

        // Determine PDF page dimensions in mm
        let pageW = 210;
        let pageH = 297;
        let orientation: 'p' | 'l' = 'p';

        if (opts.pageSize === 'fit') {
          // Convert pixels to mm (96 DPI)
          const pxToMm = 25.4 / 96;
          pageW = Math.max(10, itemEffW * pxToMm);
          pageH = Math.max(10, itemEffH * pxToMm);
          orientation = pageW > pageH ? 'l' : 'p';
          doc.addPage([pageW, pageH], orientation);
        } else {
          const baseW = opts.pageSize === 'a4' ? 210 : 215.9;
          const baseH = opts.pageSize === 'a4' ? 297 : 279.4;
          const isItemLandscape =
            opts.orientation === 'landscape' ||
            (opts.orientation === 'auto' && itemEffW > itemEffH);

          pageW = isItemLandscape ? baseH : baseW;
          pageH = isItemLandscape ? baseW : baseH;
          orientation = isItemLandscape ? 'l' : 'p';
          doc.addPage(opts.pageSize === 'a4' ? 'a4' : 'letter', orientation);
        }

        // Margin
        let m = 0;
        if (opts.pageSize !== 'fit') {
          if (opts.margin === 'small') m = 10;
          if (opts.margin === 'normal') m = 20;
        }

        const availW = pageW - m * 2;
        const availH = pageH - m * 2;

        let finalW = availW;
        let finalH = availH;
        let x = m;
        let y = m;

        if (opts.pageSize !== 'fit') {
          const imgRatio = itemEffW / itemEffH;
          const pageRatio = availW / availH;

          if (opts.fit === 'contain') {
            if (imgRatio > pageRatio) {
              finalW = availW;
              finalH = availW / imgRatio;
              y = m + (availH - finalH) / 2;
            } else {
              finalH = availH;
              finalW = availH * imgRatio;
              x = m + (availW - finalW) / 2;
            }
          } else {
            // cover
            if (imgRatio > pageRatio) {
              finalH = availH;
              finalW = availH * imgRatio;
              x = m + (availW - finalW) / 2;
            } else {
              finalW = availW;
              finalH = availW / imgRatio;
              y = m + (availH - finalH) / 2;
            }
          }
        } else {
          finalW = pageW;
          finalH = pageH;
          x = 0;
          y = 0;
        }

        // Draw page background if not transparent
        if (opts.bgType !== 'transparent' && opts.pageSize !== 'fit') {
          const pageBgColor = opts.bgType === 'color' ? opts.bgColor : '#ffffff';
          doc.setFillColor(pageBgColor);
          doc.rect(0, 0, pageW, pageH, 'F');
        }

        // Add image to page
        doc.addImage(imgData, imgFormat, x, y, finalW, finalH);

        // Page number
        if (opts.pageNumbers) {
          doc.setFontSize(9);
          doc.setTextColor(100, 116, 139);
          const pageNumY = pageH - Math.max(m / 2, 4);
          doc.text(String(i + 1), pageW / 2, pageNumY, { align: 'center' });
        }
      }

      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      setResult({ size: blob.size, url });
    } catch (e) {
      console.error(e);
      setMsg('Das PDF konnte nicht erstellt werden. Bitte versuchen Sie es erneut.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <section className="ed" id="tool" aria-label="PNG in PDF Converter">
        <div className="tb">
          <label className="btn p sm" id="addbtn">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            PNG-Bilder hinzufügen
            <input
              ref={fileInputRef1}
              className="sr"
              type="file"
              accept=".png,image/png"
              multiple
              onChange={(e) => {
                if (e.target.files) addFiles(e.target.files);
                e.target.value = '';
              }}
            />
          </label>
          <button
            className="btn s sm"
            type="button"
            id="sort"
            hidden={items.length < 2}
            onClick={sortByName}
          >
            Nach Namen sortieren
          </button>
          <button
            className="btn s sm dg"
            type="button"
            id="clear"
            hidden={items.length === 0}
            onClick={removeAll}
          >
            Alle entfernen
          </button>
          <span className="cnt tn" id="cnt">
            {items.length > 0 &&
              `${items.length} ${items.length === 1 ? 'Seite' : 'Seiten'} · ${fmt(totalSize)}`}
          </span>
        </div>

        {msg && (
          <p className="msg" id="msg" role="alert">
            {msg}
          </p>
        )}

        <div
          className={`drop ${isOver ? 'over' : ''}`}
          id="drop"
          onDragEnter={(e) => {
            if (dragId === null) {
              e.preventDefault();
              setIsOver(true);
            }
          }}
          onDragOver={(e) => {
            if (dragId === null) {
              e.preventDefault();
              setIsOver(true);
            }
          }}
          onDragLeave={(e) => {
            if (dragId === null) {
              e.preventDefault();
              setIsOver(false);
            }
          }}
          onDrop={onDropFiles}
        >
          {items.length === 0 && (
            <label className="empty" id="empty">
              <span className="ic">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 16V4m-5 5 5-5 5 5M5 20h14" />
                </svg>
              </span>
              <strong>PNG-Bilder hier ablegen</strong>
              <small>oder auswählen · mehrere Dateien möglich · Einfügen mit Strg + V / Cmd + V</small>
              <span className="btn p">PNG-Bilder auswählen</span>
              <input
                ref={fileInputRef2}
                className="sr"
                type="file"
                accept=".png,image/png"
                multiple
                onChange={(e) => {
                  if (e.target.files) addFiles(e.target.files);
                  e.target.value = '';
                }}
              />
            </label>
          )}

          {items.length > 0 && (
            <div className="ws" id="ws">
              <div className="lp">
                <ol className="rows" id="rows" aria-label="Seiten">
                  {items.map((it, i) => (
                    <li
                      key={it.id}
                      className={`row ${it.id === sel ? 'on' : ''} ${
                        dragId === it.id ? 'drag' : ''
                      } ${dragTargetId === it.id ? 'tgt' : ''}`}
                      draggable
                      onDragStart={(e) => onDragStart(e, it.id)}
                      onDragOver={(e) => onDragOverItem(e, it.id)}
                      onDrop={(e) => onDropItem(e, it.id)}
                      onDragEnd={onDragEnd}
                      onClick={() => setSel(it.id)}
                    >
                      <span className="n tn">{i + 1}</span>
                      <div className="t">
                        <img
                          src={it.url}
                          alt=""
                          style={{ transform: `rotate(${it.rot}deg)` }}
                        />
                      </div>
                      <div className="i">
                        <b title={it.file.name}>{it.file.name}</b>
                        <small className="tn">
                          {fmt(it.file.size)}
                          {it.w ? ` · ${it.w} × ${it.h} px` : ''}
                        </small>
                      </div>
                      <button
                        className="x"
                        type="button"
                        aria-label={`${it.file.name} entfernen`}
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(it.id);
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          aria-hidden="true"
                        >
                          <path d="M6 6l12 12M18 6 6 18" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mp">
                <div className="pt">
                  <div className="nav">
                    <button
                      type="button"
                      id="prev"
                      aria-label="Vorherige Seite"
                      disabled={!curItem || curIdx <= 0}
                      onClick={() => {
                        if (curIdx > 0) setSel(items[curIdx - 1].id);
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m15 6-6 6 6 6" />
                      </svg>
                    </button>
                    <span className="tn" id="pos">
                      {curItem ? `Seite ${curIdx + 1} von ${items.length}` : ''}
                    </span>
                    <button
                      type="button"
                      id="next"
                      aria-label="Nächste Seite"
                      disabled={!curItem || curIdx >= items.length - 1}
                      onClick={() => {
                        if (curIdx < items.length - 1) setSel(items[curIdx + 1].id);
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m9 6 6 6-6 6" />
                      </svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    id="up"
                    disabled={!curItem || curIdx <= 0}
                    onClick={() => {
                      if (curItem && curIdx > 0) move(curItem.id, curIdx - 1);
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m6 15 6-6 6 6" />
                    </svg>
                    <span>Nach vorn</span>
                  </button>
                  <button
                    type="button"
                    id="down"
                    disabled={!curItem || curIdx >= items.length - 1}
                    onClick={() => {
                      if (curItem && curIdx < items.length - 1) move(curItem.id, curIdx + 1);
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                    <span>Nach hinten</span>
                  </button>
                  <button
                    type="button"
                    id="rot"
                    disabled={!curItem}
                    onClick={() => {
                      if (curItem) rotate(curItem.id);
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 12a8 8 0 1 1-2.6-5.9M20 4v5h-5" />
                    </svg>
                    <span>Drehen</span>
                  </button>
                </div>

                <div className="stage">
                  <div
                    className="sheet"
                    id="sheet"
                    style={{
                      aspectRatio: `${previewRatio}`,
                      background: previewBg,
                    }}
                  >
                    <div
                      className="pimg"
                      id="pimg"
                      style={{
                        padding: previewPadding,
                        boxSizing: 'border-box',
                      }}
                    >
                      {curItem && (
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                          <img
                            src={curItem.url}
                            alt={`Vorschau Seite ${curIdx + 1}`}
                            style={{
                              position: 'absolute',
                              left: '50%',
                              top: '50%',
                              transform: `translate(-50%, -50%) rotate(${curItem.rot}deg)`,
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit:
                                opts.fit === 'cover' && opts.pageSize !== 'fit'
                                  ? 'cover'
                                  : 'contain',
                            }}
                          />
                        </div>
                      )}
                    </div>
                    {opts.pageNumbers && (
                      <div className="pn tn" id="pn">
                        {curIdx + 1}
                      </div>
                    )}
                  </div>
                </div>
                <p className="cap tn" id="pcap">
                  {curItem ? pcapText : ''}
                </p>
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div id="after">
            <div className="set">
              <div className="sg">
                <div className="fld">
                  <label htmlFor="size">Seitengröße</label>
                  <select
                    id="size"
                    value={opts.pageSize}
                    onChange={(e) => {
                      clearResult();
                      setOpts({ ...opts, pageSize: e.target.value as Options['pageSize'] });
                    }}
                  >
                    <option value="a4">DIN A4</option>
                    <option value="letter">US Letter</option>
                    <option value="fit">An Bild anpassen</option>
                  </select>
                </div>

                <div className="fld">
                  <label htmlFor="orient">Ausrichtung</label>
                  <select
                    id="orient"
                    disabled={opts.pageSize === 'fit'}
                    value={opts.orientation}
                    onChange={(e) => {
                      clearResult();
                      setOpts({ ...opts, orientation: e.target.value as Options['orientation'] });
                    }}
                  >
                    <option value="auto">Automatisch</option>
                    <option value="portrait">Hochformat</option>
                    <option value="landscape">Querformat</option>
                  </select>
                </div>

                <div className="fld">
                  <label htmlFor="margin">Seitenrand</label>
                  <select
                    id="margin"
                    value={opts.margin}
                    onChange={(e) => {
                      clearResult();
                      setOpts({ ...opts, margin: e.target.value as Options['margin'] });
                    }}
                  >
                    <option value="none">Kein Rand</option>
                    <option value="small">Klein</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>

                <div className="fld">
                  <label htmlFor="fit">Bildanpassung</label>
                  <select
                    id="fit"
                    disabled={opts.pageSize === 'fit'}
                    value={opts.fit}
                    onChange={(e) => {
                      clearResult();
                      setOpts({ ...opts, fit: e.target.value as Options['fit'] });
                    }}
                  >
                    <option value="contain">Ganzes Bild zeigen</option>
                    <option value="cover">Seite füllen</option>
                  </select>
                </div>

                <div className="fld">
                  <label htmlFor="comp">Komprimierung</label>
                  <select
                    id="comp"
                    value={opts.compression}
                    onChange={(e) => {
                      clearResult();
                      setOpts({ ...opts, compression: e.target.value as Options['compression'] });
                    }}
                  >
                    <option value="lossless">Verlustfrei</option>
                    <option value="optimized">Optimiert (kleiner)</option>
                  </select>
                  <p className="hint" id="cnote">
                    {opts.compression === 'lossless'
                      ? 'PNG-Qualität bleibt erhalten. Die Datei wird größer.'
                      : 'Kleinere Datei, ideal für Fotos. Kann Text und Kanten leicht unscharf machen.'}
                  </p>
                </div>

                <div className="fld">
                  <span className="lb">Seitenzahlen</span>
                  <div className="tg">
                    <input
                      type="checkbox"
                      id="nums"
                      role="switch"
                      checked={opts.pageNumbers}
                      onChange={(e) => {
                        clearResult();
                        setOpts({ ...opts, pageNumbers: e.target.checked });
                      }}
                    />
                    <label htmlFor="nums">Unten auf jeder Seite</label>
                  </div>
                </div>
              </div>

              <div className="fld">
                <span className="lb" id="bgl">
                  Hintergrund
                </span>
                <div className="sws" role="radiogroup" aria-labelledby="bgl">
                  <label className="sw">
                    <input
                      type="radio"
                      name="bg"
                      value="white"
                      checked={opts.bgType === 'white'}
                      onChange={() => {
                        clearResult();
                        setOpts({ ...opts, bgType: 'white' });
                      }}
                    />
                    <span>
                      <i className="dot" style={{ background: '#fff' }} />
                      Weiß
                    </span>
                  </label>

                  <label className="sw">
                    <input
                      type="radio"
                      name="bg"
                      value="transparent"
                      checked={opts.bgType === 'transparent'}
                      onChange={() => {
                        clearResult();
                        setOpts({ ...opts, bgType: 'transparent' });
                      }}
                    />
                    <span>
                      <i className="dot ck" />
                      Transparent
                    </span>
                  </label>

                  <label className="sw">
                    <input
                      type="radio"
                      name="bg"
                      value="color"
                      id="bgc"
                      checked={opts.bgType === 'color'}
                      onChange={() => {
                        clearResult();
                        setOpts({ ...opts, bgType: 'color' });
                      }}
                    />
                    <span>
                      <input
                        type="color"
                        id="cc"
                        value={opts.bgColor}
                        aria-label="Eigene Farbe"
                        onChange={(e) => {
                          clearResult();
                          setOpts({ ...opts, bgType: 'color', bgColor: e.target.value });
                        }}
                      />{' '}
                      Eigene Farbe
                    </span>
                  </label>
                </div>
                <p className="hint">
                  Gilt für transparente Bereiche Ihrer PNG-Bilder und für Ränder.
                </p>
              </div>

              {opts.bgType === 'transparent' && opts.compression === 'optimized' && (
                <p className="note" id="tnote">
                  Bei „Optimiert“ ist keine Transparenz möglich. Transparente Bereiche werden weiß
                  gefüllt.
                </p>
              )}

              <button
                className="lnk"
                type="button"
                id="defaults"
                onClick={() => {
                  clearResult();
                  setOpts(defaultOptions);
                }}
              >
                Einstellungen zurücksetzen
              </button>
            </div>

            <div className="mk">
              <div className="fn">
                <label htmlFor="fname">Dateiname</label>
                <div className="in">
                  <input
                    id="fname"
                    type="text"
                    value={filename}
                    maxLength={80}
                    autoComplete="off"
                    spellCheck="false"
                    onChange={(e) => setFilename(e.target.value)}
                  />
                  <span className="ext">.pdf</span>
                </div>
              </div>

              <button
                className="btn p"
                type="button"
                id="go"
                disabled={busy || items.length === 0}
                onClick={createPdf}
              >
                {busy ? (
                  <>
                    <span className="spin" aria-hidden="true" />
                    PDF wird erstellt …
                  </>
                ) : (
                  'PDF erstellen'
                )}
              </button>

              {result && (
                <div className="res" id="res" style={{ gridColumn: '1/-1' }}>
                  <div>
                    <strong>Ihr PDF ist fertig</strong>
                    <span className="tn" id="rsum">
                      {items.length} {items.length === 1 ? 'Seite' : 'Seiten'} · {fmt(result.size)}
                    </span>
                  </div>
                  <a
                    className="dl"
                    id="dl"
                    href={result.url}
                    download={getCleanFileName()}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 4v11m-5-4 5 5 5-5M5 20h14" />
                    </svg>
                    PDF herunterladen
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <p className="priv">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="5" y="10" width="14" height="10" rx="2.5" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
        Ihre Bilder werden nicht hochgeladen. Das PDF entsteht auf Ihrem Gerät.
      </p>
    </>
  );
}
