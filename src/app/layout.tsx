import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hisobz.uz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Hisobz — Savdo, ombor va kassa tizimi | Trade, inventory & POS",
  description:
    "Hisobz — O'zbekiston bizneslari uchun zamonaviy savdo, ombor va kassa tizimi. Oflayn kassa, Payme/Click, fiskal cheklar, SMS marketing, ko'p ombor. Desktop, web va mobil.",
  keywords: [
    "POS O'zbekiston", "kassa tizimi", "savdo tizimi", "ombor dasturi",
    "Hisobz", "Payme", "Click", "fiskal", "do'kon dasturi", "trade system Uzbekistan",
  ],
  icons: { icon: "/icon.svg" },
  manifest: undefined,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Hisobz — Savdo, ombor va kassa tizimi",
    description:
      "O'zbekiston bizneslari uchun zamonaviy savdo, ombor va kassa tizimi — oflayn kassa, mahalliy to'lovlar va fiskal cheklar bilan.",
    type: "website",
    locale: "uz_UZ",
    alternateLocale: ["ru_RU", "en_US"],
    siteName: "Hisobz",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hisobz — Savdo, ombor va kassa tizimi",
    description: "O'zbekiston bizneslari uchun zamonaviy savdo, ombor va kassa tizimi.",
  },
};

export const viewport: Viewport = {
  themeColor: "#ea580c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
