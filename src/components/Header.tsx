/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import Link from 'next/link';
import { useState, useEffect, useRef, useMemo } from 'react';
import { usePathname } from 'next/navigation';

import { liveTools } from '@/lib/config/tools';

const TOOLS = liveTools.map(t => ({ t: t.name, h: '/' + t.slug, g: t.category === 'bilder' ? 'Bilder' : t.category }));

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openDD, setOpenDD] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const ddTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const prevPathnameRef = useRef(pathname);

  // Derive search results directly
  const searchResults = useMemo(() => {
    const fold = (s: string) => s.toLowerCase().replace(/ß/g,'ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const q = fold(searchQuery.trim());
    return TOOLS.filter(x => !q || fold(x.t).includes(q) || fold(x.g).includes(q));
  }, [searchQuery]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Close menus on navigation
  useEffect(() => {
    if (pathname !== prevPathnameRef.current) {
      if (openMenu) setOpenMenu(false);
      if (openDD) setOpenDD(null);
      if (searchOpen) setSearchOpen(false);
      document.body.classList.remove('lock');
      prevPathnameRef.current = pathname;
    }
  }, [pathname, openMenu, openDD, searchOpen]);

  // Scroll handler
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Body lock for search
  useEffect(() => {
    if (searchOpen) {
      document.body.classList.add('lock');
      // small delay to let render happen before focus
      setTimeout(() => searchInputRef.current?.focus(), 10);
    } else {
      if (!openMenu) document.body.classList.remove('lock');
    }
  }, [searchOpen, openMenu]);

  // Global keydown handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (searchOpen) setSearchOpen(false);
        else if (openMenu) setOpenMenu(false);
        else setOpenDD(null);
      }
      if (e.key === '/' && !/input|textarea/i.test(document.activeElement?.tagName || '') && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, openMenu]);

  // Click outside for desktop nav
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (window.innerWidth >= 1024 && navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDD(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleMenuToggle = () => {
    const nextOpen = !openMenu;
    setOpenMenu(nextOpen);
    if (nextOpen) {
      document.body.classList.add('lock');
      if (navRef.current && headerRef.current) {
        navRef.current.style.top = Math.max(0, headerRef.current.getBoundingClientRect().bottom) + 'px';
      }
    } else {
      document.body.classList.remove('lock');
    }
  };

  const handleDDToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDD(openDD === id ? null : id);
  };

  const handleDDEnter = (id: string) => {
    if (window.innerWidth >= 1024 && window.matchMedia('(hover:hover)').matches) {
      if (ddTimeoutRef.current) clearTimeout(ddTimeoutRef.current);
      setOpenDD(id);
    }
  };

  const handleDDLeave = () => {
    if (window.innerWidth >= 1024 && window.matchMedia('(hover:hover)').matches) {
      ddTimeoutRef.current = setTimeout(() => {
        setOpenDD(null);
      }, 150);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && searchResults[selectedIndex]) {
      window.location.href = searchResults[selectedIndex].h;
    }
  };

  return (
    <>
      <a className="skip" href="#inhalt">Zum Inhalt springen</a>

      <div className="topbar">
        <div>
          <svg width="15" height="15"><use href="#s-lock"/></svg>
          <span className="long">Ihre Dateien verlassen nie Ihr Gerät – alles wird direkt im Browser verarbeitet.</span>
          <span className="short">Dateien bleiben auf Ihrem Gerät</span>
        </div>
      </div>

      <header ref={headerRef} className={`header ${scrolled ? 'scrolled' : ''}`} id="header">
        <div className="bar">
          <Link className="logo" href="/" aria-label="DateiWerk – zur Startseite">
            <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
              <rect width="36" height="36" rx="10" fill="#1D4ED8"/>
              <path d="M11 8h10l6 6v14a1 1 0 0 1-1 1H11a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" fill="#fff"/>
              <path d="M21 8v6h6" fill="#BFDBFE"/>
              <path d="M18.5 16.5v7m-3-3 3 3 3-3" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Datei<b>Werk</b></span>
          </Link>

          <nav className={`nav ${openMenu ? 'open' : ''}`} id="nav" aria-label="Hauptnavigation" ref={navRef}>
            <ul>
              <li onMouseEnter={() => handleDDEnter('bilder')} onMouseLeave={handleDDLeave}>
                <button className="nav-btn" aria-expanded={openDD === 'bilder'} aria-controls="dd-bilder" onClick={(e) => handleDDToggle('bilder', e)}>
                  <span className="ico i-img"><svg width="16" height="16"><use href="#s-img"/></svg></span>Bilder
                  <svg className="chev" width="16" height="16"><use href="#s-chev"/></svg>
                </button>
                <div className={`dd ${openDD === 'bilder' ? 'show' : ''}`} id="dd-bilder">
                  {liveTools.map(t => (
                    <Link key={t.slug} className="t" href={'/' + t.slug}>{t.name}<small>Kostenlos & schnell</small></Link>
                  ))}
                </div>
              </li>
              
              
              
            </ul>
          </nav>

          <button className="search-btn" id="sbtn" aria-label="Werkzeug suchen" onClick={() => setSearchOpen(true)}>
            <svg width="18" height="18"><use href="#s-search"/></svg><span>Werkzeug suchen</span><kbd>/</kbd>
          </button>
          <button className="burger" id="burger" aria-label={openMenu ? 'Menü schließen' : 'Menü öffnen'} aria-expanded={openMenu} aria-controls="nav" onClick={handleMenuToggle}><i></i></button>
        </div>
      </header>

      {/* Search Overlay */}
      <div className={`ov ${searchOpen ? 'open' : ''}`} id="ov" role="dialog" aria-modal="true" aria-label="Werkzeug suchen" onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}>
        <div className="sbox">
          <div className="sfield">
            <svg width="20" height="20"><use href="#s-search"/></svg>
            <input 
              ref={searchInputRef}
              id="sin" 
              type="search" 
              placeholder="z. B. PDF zusammenfügen" 
              autoComplete="off" 
              aria-label="Suchbegriff"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <button className="sclose" id="sclose" type="button" onClick={() => setSearchOpen(false)}>Esc</button>
          </div>
          <ul className="sres" id="sres">
            {searchResults.length > 0 ? (
              searchResults.map((x, i) => (
                <li key={i}>
                  <Link href={x.h} className={i === selectedIndex ? 'on' : ''}>
                    {x.t}<em>{x.g}</em>
                  </Link>
                </li>
              ))
            ) : (
              <li className="sempty">Kein Werkzeug gefunden. Versuchen Sie es mit „PDF“ oder „Bild“.</li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
