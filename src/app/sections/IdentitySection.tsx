"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { FadeIn } from "../components/FadeIn";

export function IdentitySection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={ref}
      className="relative bg-sand text-sunrust overflow-hidden"
    >
      {/* Split layout */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-[85vh]">
        {/* Left — identity text */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 xl:px-28 py-24 sm:py-32">
          <FadeIn>
            <p className="text-xs tracking-[0.25em] text-sunrust/40 mb-6">
              Kertasari, Sumbawa Barat
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-[-0.05em] leading-[0.88] mb-6">
              Restaurant
              <br />
              <span className="text-black-magic">&</span> Coffee Bar
            </h2>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div className="w-12 h-[1px] bg-sunrust/15 mb-8" />
          </FadeIn>

          <FadeIn delay={0.35}>
            <p
              className="text-xs sm:text-sm tracking-[-0.01em] leading-relaxed opacity-45 max-w-[36ch]"
              style={{ fontFamily: "var(--font-kisrre-rounded)" }}
            >
              Belgian Roots, Local Soul. We Cook
              What The Island Gives Us And Brew
              What Keeps The Surfers Coming Back.
            </p>
          </FadeIn>

          <FadeIn delay={0.45}>
            <p className="text-xs tracking-[0.15em] opacity-20 mt-10">
              Open Daily &bull; Near Lakey Peak
            </p>
          </FadeIn>
        </div>

        {/* Right — interior photo with people, grain treatment */}
        <div className="relative lg:w-[48%] h-[55vh] lg:h-auto overflow-hidden">
          <motion.div className="absolute inset-0" style={{ y: photoY }}>
            <Image
              src="/photos/bukito-barista.webp"
              alt="Barista preparing coffee inside Bukito restaurant, Kertasari Sumbawa"
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover"
            />
          </motion.div>
          {/* Warm grain overlay for consistent film look */}
          <div className="absolute inset-0 bg-sunrust/[0.04]" />
          <div className="absolute inset-0 noise pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
