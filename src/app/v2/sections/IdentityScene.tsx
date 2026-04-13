"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeIn } from "../../components/FadeIn";
import { fetchSiteSetting } from "../../../lib/supabase-fetch";
import { ScatteredPolaroid } from "../components/ScatteredPolaroid";
import { MenuFoldout } from "./TableScene";

type IdentityData = {
  established: string;
  blurb: string;
  image: string;
  imageAlt: string;
};

const FALLBACK: IdentityData = {
  established: "Est. 2024 \u00b7 Kertasari",
  blurb: "Belgian Kitchen Meets Local Soul. Surf Town Restaurant At The End Of The Road. From Breakfast Buns To Smash Burgers, Espresso To Evening Cocktails. Where The Surf Crowd Meets The Village.",
  image: "/photos/BUKITO_IG19.webp",
  imageAlt:
    "Tropical atmosphere at Bukito restaurant, Kertasari, Sumbawa Barat",
};

const CDN =
  "https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/public/media/Bukito%20brand%20book";

export function IdentityScene() {
  const [data, setData] = useState<IdentityData>(FALLBACK);
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const accentY = useTransform(scrollYProgress, [0, 1], [60, -20]);

  useEffect(() => {
    fetchSiteSetting<IdentityData>("identity").then((val) => {
      if (val) {
        setData({
          ...FALLBACK,
          ...val,
          // Override the exterior photo — use atmosphere shot
          image: "/photos/BUKITO_IG19.webp",
        });
      }
    });
  }, []);

  return (
    <section
      ref={ref}
      className="relative bg-sand text-sunrust overflow-hidden"
    >
      <div className="noise absolute inset-0 pointer-events-none opacity-40" />

      {/* Desktop: two-column editorial split. Mobile: stacked. */}
      <div className="relative z-10 grid lg:grid-cols-2 min-h-[80vh]">
        {/* LEFT — Text column */}
        <div className="flex flex-col justify-center px-8 py-20 sm:px-16 sm:py-28 lg:px-20 lg:py-32">
          <FadeIn>
            <p className="text-[11px] tracking-[0.25em] opacity-20 mb-6">
              {data.established}
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] leading-[0.88] tracking-[-0.04em] mb-8">
              Coffee Bar
              <br />
              &amp; Restaurant
            </h2>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p
              className="text-sm sm:text-base lg:text-lg tracking-[-0.02em] leading-[1.4] opacity-55 max-w-[38ch]"
              style={{ fontFamily: "var(--font-kisrre-rounded)" }}
            >
              {data.blurb}
            </p>
          </FadeIn>

          <FadeIn delay={0.2} className="mt-10">
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-sunrust/15" />
              <p className="text-[11px] tracking-[0.15em] opacity-20">
                Open Daily 7:30 AM &middot; Closed Tuesday
              </p>
            </div>
          </FadeIn>

          {/* Menu — embedded right under Open Daily */}
          <FadeIn delay={0.25} className="mt-10">
            <MenuFoldout />
          </FadeIn>
        </div>

        {/* RIGHT — Photo column with parallax + accent image */}
        <div className="relative lg:min-h-[80vh]">
          {/* Main photo — full height on desktop */}
          <motion.div
            style={{ y: photoY }}
            className="relative h-[50vh] lg:absolute lg:inset-0 lg:h-auto"
          >
            <Image
              src="/photos/BUKITO_IG19.webp"
              alt={data.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-sand/20 pointer-events-none" />
            <div className="noise absolute inset-0 pointer-events-none" />
          </motion.div>

          {/* Random polaroid overlapping the main image */}
          <motion.div
            style={{ y: accentY }}
            className="absolute bottom-8 left-6 z-20 hidden lg:block"
          >
            <ScatteredPolaroid seed={1} rotate={3} opacity={0.3} maxTilt={6} />
          </motion.div>
        </div>
      </div>

    </section>
  );
}
