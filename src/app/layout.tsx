import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SvgSymbols from "@/components/SvgSymbols";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZappTool – Kostenlose Online-Werkzeuge für Bilder und PDF",
  description: "Bilder komprimieren, konvertieren und PDFs bearbeiten – direkt im Browser, ohne Upload.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${plusJakartaSans.variable} antialiased`}
    >
      <body>
        <SvgSymbols />
        <Header />
        <main id="inhalt">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
