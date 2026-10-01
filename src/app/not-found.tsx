import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ padding: 'clamp(80px, 12vw, 160px) 24px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontSize: 'clamp(4rem, 10vw, 7rem)', fontWeight: 800, margin: '0 0 16px', color: 'var(--primary)', lineHeight: 1 }}>
        404
      </h1>
      <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', margin: '0 0 24px', fontWeight: 700 }}>
        Seite nicht gefunden
      </h2>
      <p style={{ color: 'var(--muted)', maxWidth: '460px', margin: '0 auto 40px', lineHeight: 1.6, fontSize: '1.0625rem' }}>
        Die gesuchte Seite existiert leider nicht. Möglicherweise wurde sie verschoben, oder die eingegebene Adresse ist falsch.
      </p>
      <Link href="/" className="btn p" style={{ display: 'inline-flex' }}>
        Zurück zur Startseite
      </Link>
    </main>
  );
}
