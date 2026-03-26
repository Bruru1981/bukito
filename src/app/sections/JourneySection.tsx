"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FadeIn } from "../components/FadeIn";

const steps = [
  { num: "01", place: "Lombok", label: "Fly Into LOP", detail: "International flights daily" },
  { num: "02", place: "Sumbawa", label: "Ferry Across", detail: "Poto Tano, 2 hours" },
  { num: "03", place: "Kertasari", label: "Drive West", detail: "Coast road, 45 minutes" },
  { num: "04", place: "The Snake", label: "Look For It", detail: "You'll know" },
];

function Step({ num, place, label, detail, index }: {
  num: string;
  place: string;
  label: string;
  detail: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.9, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="relative border-b border-sand/8 py-8 sm:py-12 lg:py-16"
    >
      {/* Huge background number */}
      <span
        className="absolute right-0 top-1/2 -translate-y-1/2 text-[120px] sm:text-[180px] lg:text-[240px] tracking-[-0.06em] leading-none text-sand/[0.03] font-normal pointer-events-none select-none"
        aria-hidden="true"
      >
        {num}
      </span>

      {/* Content */}
      <div className="relative z-10 flex items-baseline gap-4 sm:gap-8">
        <span className="text-xs tracking-[0.2em] text-sand/40 shrink-0 w-16 sm:w-24">
          {label}
        </span>
        <span className="text-3xl sm:text-5xl lg:text-7xl tracking-[-0.04em] text-sand flex-1">
          {place}
        </span>
        <span className="text-xs tracking-[0.05em] text-sand/25 hidden sm:block shrink-0">
          {detail}
        </span>
      </div>
    </motion.div>
  );
}

export function JourneySection() {
  return (
    <section className="relative bg-black-magic text-sand overflow-hidden py-28 sm:py-40 px-8 sm:px-16 lg:px-20">
      <div className="noise absolute inset-0 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <FadeIn className="mb-20 sm:mb-28">
          <p className="text-xs tracking-[0.25em] text-sand/25 mb-5">
            How To Find Us
          </p>
          <h2 className="text-5xl sm:text-7xl lg:text-8xl tracking-[-0.05em] leading-[0.85]">
            The
            <br />
            Journey
          </h2>
        </FadeIn>

        {/* "Near Lakey Peak" — standalone typographic moment */}
        <FadeIn delay={0.15} className="mb-16 sm:mb-20">
          <p className="text-sm sm:text-base tracking-[0.1em] text-sand/35">
            Near Lakey Peak, Sumbawa Barat
          </p>
        </FadeIn>

        {/* Steps */}
        <div>
          {steps.map((step, i) => (
            <Step key={step.num} {...step} index={i} />
          ))}
        </div>

        {/* Coordinates + maps */}
        <FadeIn delay={0.3} className="mt-20 sm:mt-28 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8">
          <div>
            <p className="text-xs tracking-[0.2em] text-sand/15 mb-2">Coordinates</p>
            <p className="text-lg sm:text-2xl tracking-[-0.02em] text-sand/40">
              8&deg;33&apos;S &bull; 116&deg;47&apos;E
            </p>
          </div>
          <a
            href="https://maps.app.goo.gl/bukito-sumbawa"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-xs tracking-[0.1em] text-sand/40 hover:text-sand transition-colors"
          >
            Open In Maps
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              aria-hidden="true"
            >
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
