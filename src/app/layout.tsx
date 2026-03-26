import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "./components/SmoothScroll";

export const metadata: Metadata = {
  metadataBase: new URL("https://bukito.com"),
  title: "BUKITO — Restaurant & Coffee | Kertasari, Sumbawa",
  description:
    "Where the jungle meets the sea. Restaurant, coffee, and good times in Kertasari, Sumbawa Barat. Belgian kitchen meets local soul. Open daily.",
  keywords: [
    "Bukito",
    "Bukito Sumbawa",
    "restaurant Kertasari",
    "cafe Sumbawa",
    "surf Sumbawa",
    "best burger Sumbawa",
    "coffee shop surf Sumbawa",
    "restaurant near Lakey Peak",
  ],
  openGraph: {
    title: "BUKITO — Paradise With Fangs",
    description:
      "Restaurant, coffee, and wild nights in Kertasari, Sumbawa. From here you can almost see the sea.",
    type: "website",
    locale: "en_US",
    siteName: "BUKITO",
    images: [
      {
        url: "/photos/bukito-exterior.webp",
        width: 1200,
        height: 630,
        alt: "Bukito restaurant exterior in Kertasari, Sumbawa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BUKITO — Paradise With Fangs",
    description:
      "Restaurant, coffee, and wild nights in Kertasari, Sumbawa.",
    images: ["/photos/bukito-exterior.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

function RestaurantJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Bukito",
    description:
      "Restaurant and coffee bar in Kertasari, Sumbawa Barat. Belgian kitchen meets local soul.",
    servesCuisine: ["Belgian", "Indonesian", "International"],
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Pantai Kertasari",
      addressLocality: "Sumbawa Besar",
      addressRegion: "Nusa Tenggara Barat",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -8.55,
      longitude: 116.783,
    },
    url: "https://bukito.com",
    telephone: "+6282234606010",
    image: "/photos/bukito-exterior.webp",
    sameAs: [
      "https://instagram.com/bukito.sumbawa",
      "https://tiktok.com/@bukito.sumbawa",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <RestaurantJsonLd />
      </head>
      <body className="min-h-full flex flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
