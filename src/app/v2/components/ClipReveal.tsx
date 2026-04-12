"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ClipRevealProps {
  children: ReactNode;
  type?: "inset-up" | "inset-left" | "circle";
  scrollRange?: [number, number];
  className?: string;
}

const clipTemplates = {
  "inset-up": {
    from: "inset(100% 0 0 0)",
    to: "inset(0 0 0 0)",
  },
  "inset-left": {
    from: "inset(0 100% 0 0)",
    to: "inset(0 0 0 0)",
  },
  circle: {
    from: "circle(0% at 50% 50%)",
    to: "circle(100% at 50% 50%)",
  },
};

export function ClipReveal({
  children,
  type = "inset-up",
  scrollRange = [0.1, 0.6],
  className = "",
}: ClipRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const clip = clipTemplates[type];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const clipPath = useTransform(
    scrollYProgress,
    scrollRange,
    [clip.from, clip.to]
  );

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ clipPath }}>{children}</motion.div>
    </div>
  );
}
