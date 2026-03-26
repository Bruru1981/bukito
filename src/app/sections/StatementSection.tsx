"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function StatementSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const stampOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 0.04]);
  const stampRotate = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center bg-sand text-sunrust overflow-hidden"
    >
      {/* Stamp watermark — barely visible */}
      <motion.div
        className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] pointer-events-none"
        style={{ opacity: stampOpacity, rotate: stampRotate }}
      >
        <img
          src="/BUKITO_StampDistorted.png"
          alt=""
          className="w-full h-full object-contain"
          aria-hidden="true"
        />
      </motion.div>

      {/* The sentence. Nothing else. */}
      <div className="relative z-10 px-8 sm:px-16 lg:px-24 py-32 sm:py-40">
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(2.5rem,8vw,12rem)] font-normal leading-[0.88] tracking-[-0.05em] max-w-[12ch]"
        >
          From Here
          <br />
          You Can
          <br />
          Almost See
          <br />
          The Sea
        </motion.h2>
      </div>
    </section>
  );
}
