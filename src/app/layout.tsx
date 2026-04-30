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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://nammaooru.in"),
  title: "Namma Ooru · ನಮ್ಮ ಊರು",
  description:
    "Bengaluru is chaotic, complicated, and occasionally infuriating. It is also extraordinary. Live traffic, weather, Kannada, lakes, startups — a quiet celebration of our city.",
  keywords: ["Bangalore", "Bengaluru", "Namma Ooru", "Kannada", "Karnataka", "traffic", "city portal"],
  openGraph: {
    title: "Namma Ooru · ನಮ್ಮ ಊರು",
    description:
      "Bengaluru is chaotic, complicated, and occasionally infuriating. It is also extraordinary. A quiet celebration of our city.",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cubbon Park, Bengaluru — the green heart of the city",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Namma Ooru · ನಮ್ಮ ಊರು",
    description: "A quiet celebration of Bengaluru.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
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
