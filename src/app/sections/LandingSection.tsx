"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const STORAGE =
  "https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/public/media/Bukito%20brand%20book";

export function LandingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <motion.section
      ref={ref}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      style={{ opacity }}
      aria-label="Bukito restaurant hero"
    >
      {/* Video */}
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
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black-magic/50 z-[1]" />
      <div className="absolute inset-0 z-[2] noise" />

      {/* Wordmark — centered, floating, nothing else */}
      <motion.div
        className="relative z-[3]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={`${STORAGE}/wordmarks/BUKITO_WordmarkDistorted.png`}
          alt="BUKITO"
          width={600}
          height={120}
          priority
          className="w-[240px] sm:w-[360px] lg:w-[480px] xl:w-[560px] invert"
        />
      </motion.div>

      {/* Scroll line — thin vertical line growing at bottom center */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[4]">
        <div className="scroll-line w-[1px] h-16 bg-sand/20" />
      </div>
    </motion.section>
  );
}
