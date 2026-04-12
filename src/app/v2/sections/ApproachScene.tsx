"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { TiltPhoto } from "../components/TiltPhoto";
import { FadeIn } from "../../components/FadeIn";
import { fetchSiteSetting } from "../../../lib/supabase-fetch";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

type ApproachData = {
  line1: string;
  line2: string;
  subtitle: string;
};

const FALLBACK_APPROACH: ApproachData = {
  line1: "Where The Road Ends",
  line2: "And The Snake Begins",
  subtitle: "Restaurant \u00b7 Coffee \u00b7 Kertasari",
};

const satellites = [
  {
    src: "/photos/BUKITO_IG3.webp",
    alt: "Cat sleeping at Bukito",
    w: 200, h: 260,
    pos: "top-[8%] right-[5%] sm:right-[10%]",
    rotate: -3,
    scrollIn: [0.15, 0.3] as [number, number],
  },
  {
    src: "/photos/bukito-barista.webp",
    alt: "Barista crafting coffee",
    w: 240, h: 320,
    pos: "bottom-[5%] left-[50%] -translate-x-1/2 sm:left-[35%]",
    rotate: 2,
    scrollIn: [0.22, 0.37] as [number, number],
  },
  {
    src: "/photos/BUKITO_IG22.webp",
    alt: "Sumbawa coastline",
    w: 340, h: 180,
    pos: "bottom-[12%] right-[3%] sm:right-[8%]",
    rotate: 0,
    scrollIn: [0.28, 0.43] as [number, number],
  },
];

export function ApproachScene() {
  const ref = useRef<HTMLElement>(null);
  const [approach, setApproach] = useState<ApproachData>(FALLBACK_APPROACH);

  useEffect(() => {
    fetchSiteSetting<ApproachData>("approach").then((val) => {
      if (val) setApproach({ ...FALLBACK_APPROACH, ...val });
    });
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  /* Main image shrinks via clip-path as you scroll */
  const mainClip = useTransform(
    scrollYProgress,
    [0, 0.5],
    ["inset(0% 0% 0% 0%)", "inset(5% 15% 10% 8%)"]
  );

  return (
    <section
      ref={ref}
      className="relative min-h-[200vh] bg-sand text-sunrust"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Main hero image — shrinks on scroll */}
        <motion.div
          style={{ clipPath: mainClip }}
          className="absolute inset-[5%] sm:inset-[3%]"
        >
          <Image
            src="/photos/BUKITO_IG7.webp"
            alt="Jungle road to Bukito, Kertasari"
            fill
            priority
            className="object-cover"
          />
          <div className="noise absolute inset-0 pointer-events-none" />
        </motion.div>

        {/* Satellite photos — emerge at staggered scroll points */}
        {satellites.map((sat) => (
          <SatellitePhoto key={sat.src} sat={sat} scrollYProgress={scrollYProgress} />
        ))}

        {/* Text overlay — bottom left */}
        <div className="absolute bottom-[10%] left-8 z-20 sm:left-16 lg:left-20">
          <FadeIn y={20} duration={0.8}>
            <p className="text-[clamp(2rem,6vw,4rem)] leading-[0.9] tracking-[-0.04em] text-sand mix-blend-difference">
              {approach.line1}
            </p>
          </FadeIn>
          <FadeIn y={20} delay={0.08} duration={0.8}>
            <p className="text-[clamp(2rem,6vw,4rem)] leading-[0.9] tracking-[-0.04em] text-sand mix-blend-difference">
              {approach.line2}
            </p>
          </FadeIn>
          <FadeIn y={10} delay={0.2} duration={0.8}>
            <p className="mt-4 text-[11px] tracking-[0.2em] text-sand/30 mix-blend-difference">
              {approach.subtitle}
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* Individual satellite photo with scroll-driven reveal + tilt */
function SatellitePhoto({
  sat,
  scrollYProgress,
}: {
  sat: (typeof satellites)[0];
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(scrollYProgress, sat.scrollIn, [0, 1]);
  const clipPath = useTransform(
    scrollYProgress,
    sat.scrollIn,
    ["inset(100% 0 0 0)", "inset(0% 0% 0% 0%)"]
  );

  return (
    <motion.div
      style={{ opacity, clipPath, rotate: sat.rotate }}
      className={`absolute z-10 ${sat.pos}`}
    >
      <TiltPhoto>
        <div className="relative overflow-hidden" style={{ width: sat.w, height: sat.h }}>
          <Image
            src={sat.src}
            alt={sat.alt}
            fill
            className="object-cover"
          />
        </div>
      </TiltPhoto>
    </motion.div>
  );
}
