"use client";

import { AnimatedSection } from "../components/AnimatedSection";
import { ParallaxImage } from "../components/ParallaxImage";

export function GallerySection() {
  return (
    <section className="relative bg-sand text-sunrust">
      <div className="relative">
        <AnimatedSection variant="scale" duration={1.2}>
          <ParallaxImage
            src="/photos/BUKITO_IG3.webp"
            alt="Cat lounging at Bukito restaurant, tropical Kertasari village life in Sumbawa"
            speed={0.15}
            overlay
            overlayOpacity={0.1}
            containerClassName="h-[70vh]"
          />
        </AnimatedSection>
      </div>
      <div className="relative">
        <AnimatedSection variant="scale" duration={1.2}>
          <ParallaxImage
            src="/photos/BUKITO_IG15.webp"
            alt="Village street scene near Bukito in Kertasari, Sumbawa Barat"
            speed={0.2}
            overlay
            overlayOpacity={0.1}
            containerClassName="h-[60vh]"
          />
        </AnimatedSection>
      </div>
      <div className="relative">
        <AnimatedSection variant="scale" duration={1.2}>
          <ParallaxImage
            src="/photos/BUKITO_IG22.webp"
            alt="Ocean waves and coastline near Bukito restaurant, Sumbawa surf spot"
            speed={0.25}
            overlay
            overlayOpacity={0.1}
            containerClassName="h-[80vh]"
          />
        </AnimatedSection>
      </div>
    </section>
  );
}
