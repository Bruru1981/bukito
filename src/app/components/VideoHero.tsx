"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const STORAGE =
  "https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/public/media/Bukito%20brand%20book";

export function VideoHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <motion.section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden flex items-end justify-start"
      style={{ opacity }}
      aria-label="Bukito restaurant hero video"
    >
      {/* Background video loop */}
      <motion.div className="absolute inset-0 z-0" style={{ scale }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="/photos/BUKITO_IG7.webp"
        >
          <source src="/videos/hero-loop.mp4" type="video/mp4" />
        </video>
        <noscript>
          <Image
            src="/photos/BUKITO_IG7.webp"
            alt="Bukito restaurant in Kertasari, Sumbawa — tropical setting with palm trees"
            fill
            className="object-cover"
            priority
          />
        </noscript>
      </motion.div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black-magic/40 z-[1]" />

      {/* Grain */}
      <div className="absolute inset-0 z-[2] noise" />

      {/* Content — bottom left, editorial layout */}
      <div className="relative z-[4] p-8 sm:p-16 lg:p-20 max-w-2xl">
        {/* Distorted wordmark */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Image
            src={`${STORAGE}/wordmarks/BUKITO_WordmarkDistorted.png`}
            alt="BUKITO"
            width={480}
            height={96}
            priority
            className="w-[260px] sm:w-[380px] lg:w-[440px] invert"
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="mt-4 text-xs sm:text-sm tracking-[0.12em] text-sand/50"
        >
          Paradise With Fangs
        </motion.p>

        {/* Location — Helena's SEO keyword */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="mt-2 text-[10px] sm:text-xs tracking-[0.2em] text-sand/30"
        >
          Kertasari, Sumbawa
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2 }}
        className="absolute bottom-8 right-8 sm:right-16 z-[4]"
      >
        <div className="animate-scroll-bounce">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-sand/30"
            aria-hidden="true"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </motion.div>
    </motion.section>
  );
}
