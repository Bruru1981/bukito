"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  { label: "Fly Into", place: "Lombok (LOP)", detail: "International flights daily" },
  { label: "Ferry To", place: "Sumbawa", detail: "Poto Tano port, 2 hours" },
  { label: "Drive To", place: "Kertasari", detail: "West coast, 45 minutes" },
  { label: "Look For", place: "The Snake", detail: "You'll know when you see it" },
];

function StepLine({
  index,
  label,
  place,
  detail,
}: {
  index: number;
  label: string;
  place: string;
  detail: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex items-baseline gap-6 sm:gap-10 py-6 sm:py-8 border-b border-sand/10"
    >
      <span className="text-[10px] tracking-[0.2em] text-sand/20 shrink-0 w-8">
        0{index + 1}
      </span>
      <span className="text-xs sm:text-sm tracking-[0.1em] text-orange-beach/80 shrink-0 w-20 sm:w-28">
        {label}
      </span>
      <span className="text-2xl sm:text-4xl lg:text-5xl tracking-[-0.04em] text-sand flex-1">
        {place}
      </span>
      <span className="text-[10px] sm:text-xs tracking-[0.05em] text-sand/30 hidden sm:block shrink-0">
        {detail}
      </span>
    </motion.div>
  );
}

export function DirectionsSection() {
  return (
    <section className="relative py-28 sm:py-40 px-8 sm:px-16 bg-black-magic text-sand overflow-hidden">
      <div className="noise absolute inset-0 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-16 sm:mb-24"
        >
          <p className="text-[10px] sm:text-xs tracking-[0.2em] text-sand/30 mb-4">
            How To Find Us
          </p>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl tracking-[-0.04em] leading-[0.9]">
            Getting
            <br />
            Here
          </h2>
          {/* SEO keyword for surfers */}
          <p className="mt-4 text-[10px] sm:text-xs tracking-[0.15em] text-orange-beach/50">
            Near Lakey Peak, Sumbawa Barat
          </p>
        </motion.div>

        {/* Steps */}
        <div>
          {steps.map((step, i) => (
            <StepLine key={step.place} index={i} {...step} />
          ))}
        </div>

        {/* Coordinates + Google Maps link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 sm:mt-24 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8"
        >
          <div>
            <p className="text-[10px] tracking-[0.2em] text-sand/20 mb-2">
              Coordinates
            </p>
            <p className="text-lg sm:text-xl tracking-[-0.02em] text-sand/60">
              8&deg;33&apos;S &bull; 116&deg;47&apos;E
            </p>
          </div>

          <a
            href="https://maps.app.goo.gl/bukito-sumbawa"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-xs tracking-[0.1em] text-orange-beach/70 hover:text-orange-beach transition-colors"
          >
            Open In Maps
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              aria-hidden="true"
            >
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
