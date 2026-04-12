"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";

interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
  containerClassName?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  priority?: boolean;
}

export function ParallaxImage({
  src,
  alt,
  speed = 0.3,
  className = "",
  containerClassName = "",
  overlay = false,
  overlayOpacity = 0.3,
  priority = false,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}px`, `${speed * 100}px`]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${containerClassName}`}
    >
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          priority={priority}
          className={`object-cover ${className}`}
        />
      </motion.div>
      {overlay && (
        <div
          className="absolute inset-0 bg-black-magic z-[1]"
          style={{ opacity: overlayOpacity }}
        />
      )}
    </div>
  );
}
