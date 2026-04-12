"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { fetchSiteSetting } from "../../../lib/supabase-fetch";

const CDN =
  "https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/public/media/Bukito%20brand%20book";

type HeroData = {
  tagline: string;
  coordinates: string;
  location: string;
};

const FALLBACK_HERO: HeroData = {
  tagline: "Paradise With Fangs",
  coordinates: "8\u00b033\u2019S \u00b7 116\u00b047\u2019E",
  location: "Kertasari, Sumbawa",
};

export function GateScene() {
  const ref = useRef<HTMLElement>(null);
  const [hero, setHero] = useState<HeroData>(FALLBACK_HERO);

  useEffect(() => {
    fetchSiteSetting<HeroData>("hero").then((val) => {
      if (val) setHero({ ...FALLBACK_HERO, ...val });
    });
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.12]);
  const textOpacity = useTransform(scrollYProgress, [0.15, 0.5], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 0.8], [1, 1.08]);

  return (
    <section ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Video — full screen, no black overlay */}
        <motion.div
          style={{ scale: videoScale }}
          className="absolute inset-0 origin-center"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/videos/hero-loop.mp4" type="video/mp4" />
          </video>
          {/* aria-hidden on parent covers this decorative video */}
          {/* Subtle dark gradient at bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black-magic/50 via-transparent to-black-magic/20" />
        </motion.div>

        {/* Wordmark — distorted, centered */}
        <motion.div
          style={{ scale: textScale, opacity: textOpacity }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center"
        >
          <Image
            src={`${CDN}/wordmarks/BUKITO_WordmarkDistorted.png`}
            alt="BUKITO"
            width={600}
            height={120}
            priority
            className="max-w-[80vw] sm:max-w-[60vw]"
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          style={{ opacity: textOpacity, fontFamily: "var(--font-kisrre-rounded)" }}
          className="absolute bottom-[22%] left-0 right-0 z-20 text-center text-[11px] tracking-[0.3em] text-sand/50 sm:text-xs"
        >
          {hero.tagline}
        </motion.p>

        {/* Bottom details */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex items-end justify-between px-8 sm:px-16 lg:px-20">
          <p className="text-[11px] tracking-[0.15em] text-sand/30">
            {hero.coordinates}
          </p>
          <div className="scroll-line h-16 w-px bg-sand/30" />
          <p className="text-[11px] tracking-[0.15em] text-sand/30">
            {hero.location}
          </p>
        </div>
      </div>
    </section>
  );
}
