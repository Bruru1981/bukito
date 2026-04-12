"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { fetchSiteSetting } from "@/lib/supabase-fetch";

const CDN =
  "https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/public/media/Bukito%20brand%20book";

type TransitionData = {
  line1: string;
  line2: string;
};

const FALLBACK_TRANSITION: TransitionData = {
  line1: "When The Sun Drops",
  line2: "The Snake Comes Out",
};

export function TurnScene() {
  const ref = useRef<HTMLElement>(null);
  const [transition, setTransition] = useState<TransitionData>(FALLBACK_TRANSITION);

  useEffect(() => {
    fetchSiteSetting<TransitionData>("transition").then((val) => {
      if (val) setTransition({ ...FALLBACK_TRANSITION, ...val });
    });
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  /* Circle expands from center — reveals a landscape photo instead of black */
  const circleClip = useTransform(
    scrollYProgress,
    [0.1, 0.65],
    ["circle(0% at 50% 50%)", "circle(100% at 50% 50%)"]
  );

  const textOpacity = useTransform(scrollYProgress, [0.3, 0.45], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.3, 0.45], [20, 0]);

  return (
    <section
      ref={ref}
      className="relative flex h-screen items-center justify-center overflow-hidden"
    >
      {/* Sand background (static — the "day" side) */}
      <div className="absolute inset-0 bg-sand" />

      {/* Landscape photo expanding from center — the "night" reveal */}
      <motion.div
        style={{ clipPath: circleClip }}
        className="absolute inset-0 z-10"
      >
        <Image
          src="/photos/BUKITO_IG15.webp"
          alt="Sunset at Bukito"
          fill
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark overlay so text is readable */}
        <div className="absolute inset-0 bg-black-magic/60" />
      </motion.div>

      {/* Text inside the expanding photo circle */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-20 text-center px-8"
      >
        <p className="text-[clamp(1.5rem,5vw,3.5rem)] leading-[0.9] tracking-[-0.03em] text-sand">
          {transition.line1}
        </p>
        <p className="mt-2 text-[clamp(1.5rem,5vw,3.5rem)] leading-[0.9] tracking-[0.06em] text-sand/70">
          {transition.line2}
        </p>
      </motion.div>

      {/* Decorative nocturnal icons */}
      {[
        { icon: "Bat", top: "20%", left: "15%", size: 32 },
        { icon: "Gecko", top: "70%", left: "75%", size: 40 },
        { icon: "Scorpion", top: "30%", left: "80%", size: 28 },
      ].map((item) => (
        <motion.div
          key={item.icon}
          style={{ opacity: textOpacity, top: item.top, left: item.left }}
          className="absolute z-20 pointer-events-none"
        >
          <Image
            src={`${CDN}/icons/BUKITO_Icon_${item.icon}.png`}
            alt=""
            width={item.size}
            height={item.size}
            className="opacity-[0.12]"
            style={{ filter: "invert(1)" }}
          />
        </motion.div>
      ))}
    </section>
  );
}
