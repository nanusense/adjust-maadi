import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Namma Ooru · ನಮ್ಮ ಊರು · A Love Letter to Bengaluru",
  description:
    "The city portal for proud Bangaloreans. Lakes, parks, Kannada words, startups, famous people: celebrating everything wonderful about ಬೆಂಗಳೂರು.",
  keywords: ["Bangalore", "Bengaluru", "Kannada", "Karnataka", "India", "city portal"],
  openGraph: {
    title: "Namma Ooru · ನಮ್ಮ ಊರು",
    description: "A love letter to Bengaluru. The city portal a proud Bangalorean bookmarks.",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lora.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Kannada:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body
        className={`${inter.className} antialiased`}
        style={{ backgroundColor: "#FBF5E6" }}
      >
        {children}
      </body>
    </html>
  );
}
