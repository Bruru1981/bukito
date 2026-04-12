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
  alternates: {
    canonical: "https://bukito.com",
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
      addressLocality: "Sumbawa Barat",
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
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "08:00",
        closes: "22:00",
      },
    ],
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
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#F8F5EA" media="(prefers-color-scheme: light)" />
        <RestaurantJsonLd />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2 focus:bg-sand focus:text-sunrust"
        >
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
