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
  metadataBase: new URL("https://zapptool.de/"),
  title: "Bilder umwandeln online – JPG, PNG, HEIC, PDF | Zapp Tool",
  description: "Bilder kostenlos online umwandeln: JPG, PNG, HEIC und WebP konvertieren oder JPG in PDF. Direkt im Browser, ohne Upload und ohne Anmeldung.",
  verification: {
    google: "tnd_crD-VSU6I5PVcp_D48eBIPR4TNq4DQTubylokc8",
  },
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
