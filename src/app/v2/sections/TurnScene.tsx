"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
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

type CreatureConfig = {
  icon: string;
  top: string;
  left: string;
  size: number;
  rotateRange: [number, number];
  driftRange: [number, number];
  fadeDelay: number;
};

const CREATURES: CreatureConfig[] = [
  { icon: "Bat", top: "18%", left: "12%", size: 36, rotateRange: [-8, 12], driftRange: [30, -30], fadeDelay: 0 },
  { icon: "Gecko", top: "72%", left: "78%", size: 44, rotateRange: [5, -10], driftRange: [20, -40], fadeDelay: 0.05 },
  { icon: "Scorpion", top: "26%", left: "82%", size: 30, rotateRange: [-12, 6], driftRange: [40, -20], fadeDelay: 0.1 },
  { icon: "Spider", top: "68%", left: "18%", size: 26, rotateRange: [10, -15], driftRange: [15, -35], fadeDelay: 0.08 },
  { icon: "Serpent", top: "48%", left: "88%", size: 32, rotateRange: [-6, 8], driftRange: [25, -25], fadeDelay: 0.12 },
];

function DriftingCreature({
  creature,
  scrollYProgress,
}: {
  creature: CreatureConfig;
  scrollYProgress: MotionValue<number>;
}) {
  const opacity = useTransform(
    scrollYProgress,
    [0.22 + creature.fadeDelay, 0.38 + creature.fadeDelay],
    [0, 1],
  );
  const y = useTransform(
    scrollYProgress,
    [0.2, 0.7],
    creature.driftRange,
  );
  const rotate = useTransform(
    scrollYProgress,
    [0.15, 0.75],
    creature.rotateRange,
  );

  return (
    <motion.div
      style={{
        opacity,
        y,
        rotate,
        top: creature.top,
        left: creature.left,
      }}
      className="absolute z-20 pointer-events-none"
    >
      <Image
        src={`${CDN}/icons/BUKITO_Icon_${creature.icon}.png`}
        alt=""
        width={creature.size}
        height={creature.size}
        className="opacity-[0.18]"
        style={{ filter: "invert(1)" }}
        aria-hidden="true"
      />
    </motion.div>
  );
}

export function TurnScene() {
  const ref = useRef<HTMLElement>(null);
  const [transition, setTransition] =
    useState<TransitionData>(FALLBACK_TRANSITION);

  useEffect(() => {
    fetchSiteSetting<TransitionData>("transition").then((val) => {
      if (val) setTransition({ ...FALLBACK_TRANSITION, ...val });
    });
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const circleClip = useTransform(
    scrollYProgress,
    [0.08, 0.68],
    ["circle(14% at 50% 36%)", "circle(140% at 50% 46%)"],
  );

  const textOpacity = useTransform(scrollYProgress, [0.28, 0.44], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.28, 0.44], [20, 0]);

  return (
    <section
      ref={ref}
      className="relative flex h-screen items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-sand" />

      <motion.div
        style={{ clipPath: circleClip }}
        className="absolute inset-0 z-10"
      >
        <Image
          src="/photos/BUKITO_IG15.webp"
          alt="Sunset at Bukito"
          fill
          className="object-cover object-[center_38%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black-magic/60" />
      </motion.div>

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

      {CREATURES.map((creature) => (
        <DriftingCreature
          key={creature.icon}
          creature={creature}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </section>
  );
}
