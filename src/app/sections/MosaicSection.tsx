"use client";

import Image from "next/image";
import { FadeIn } from "../components/FadeIn";

const photos = [
  { src: "/photos/BUKITO_IG7.webp", alt: "Tropical palm trees and golden light at Bukito restaurant, Kertasari Sumbawa", span: "col-span-2 row-span-2" },
  { src: "/photos/BUKITO_IG1.webp", alt: "Fresh food plating at Bukito kitchen, Sumbawa Barat", span: "col-span-1 row-span-1" },
  { src: "/photos/BUKITO_IG11.webp", alt: "Interior atmosphere at Bukito cafe, tropical Sumbawa setting", span: "col-span-1 row-span-2" },
  { src: "/photos/BUKITO_IG24.webp", alt: "Sunset view from Bukito restaurant terrace, Kertasari coast", span: "col-span-1 row-span-1" },
  { src: "/photos/BUKITO_IG3.webp", alt: "Village cat at Bukito, everyday life in Kertasari Sumbawa", span: "col-span-1 row-span-1" },
];

export function MosaicSection() {
  return (
    <section className="relative bg-sand text-sunrust py-8 sm:py-16 px-4 sm:px-8 lg:px-16 overflow-hidden">
      {/* Pattern texture visible in the gaps */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url(/BUKITO_Pattern.png)", backgroundSize: "400px" }}
      />

      {/* Caption */}
      <FadeIn className="mb-6 sm:mb-10">
        <p className="text-xs tracking-[0.2em] opacity-25">
          Kertasari, Sumbawa Barat
        </p>
      </FadeIn>

      {/* Asymmetric grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 auto-rows-[200px] sm:auto-rows-[280px] lg:auto-rows-[320px]">
        {photos.map((photo, i) => (
          <FadeIn
            key={photo.src}
            delay={i * 0.1}
            y={30 + i * 10}
            className={`relative hover-ken-burns ${photo.span}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes={photo.span.includes("col-span-2") ? "66vw" : "33vw"}
              className="object-cover"
            />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
