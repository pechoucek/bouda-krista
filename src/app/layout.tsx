import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  metadataBase: new URL("https://bouda-krista.cz"),
  openGraph: {
    title: "Bouda Krista — Luxury Mountain Retreat",
    description: "Three designer apartments on a Krkonoše hilltop. Private sauna, stunning views, up to 11 guests.",
    url: "https://bouda-krista.cz",
    images: ["https://a0.muscache.com/im/pictures/hosting/Hosting-1681755602554370759/original/daa6a02b-06de-4b6d-8abb-cfbd6ab77c33.jpeg?im_w=1440"],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning className={`${cormorant.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
