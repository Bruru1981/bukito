"use client";

import Image from "next/image";
import {
  AnimatedSection,
  StaggerChildren,
  StaggerItem,
} from "../components/AnimatedSection";

const STORAGE =
  "https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/public/media/Bukito%20brand%20book";

const offerings = [
  {
    icon: "Coffee",
    title: "Minimal Morning Sessions",
    description:
      "Single origin beans. Slow pour. The kind of quiet that makes you listen to the waves.",
  },
  {
    icon: "Cutlery",
    title: "Belgian Roots, Island Soul",
    description:
      "Waffles and fresh catch. Recipes from Brussels, ingredients from the reef and the garden.",
  },
  {
    icon: "Surf",
    title: "Surf, Eat, Repeat",
    description:
      "Post-surf sessions. Cold drinks. Sandy feet welcome. The kind of place that becomes your routine.",
  },
];

export function OfferingsSection() {
  return (
    <section className="relative py-28 sm:py-36 px-6 bg-sunrust text-sand overflow-hidden">
      <div className="noise absolute inset-0 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <AnimatedSection variant="fadeUp" className="text-center mb-24">
          <p className="text-[10px] sm:text-xs tracking-[0.2em] opacity-40 mb-6">
            The Offering
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl tracking-[-0.04em]">
            What Awaits You
          </h2>
          <div className="editorial-divider mx-auto mt-8 bg-sand" />
        </AnimatedSection>

        <StaggerChildren
          className="grid grid-cols-1 sm:grid-cols-3 gap-16 sm:gap-12 text-center"
          stagger={0.15}
          delay={0.2}
        >
          {offerings.map((item) => (
            <StaggerItem key={item.icon}>
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 flex items-center justify-center">
                  <Image
                    src={`${STORAGE}/icons/BUKITO_Icon_${item.icon}.png`}
                    alt={item.icon}
                    width={64}
                    height={64}
                    className="invert opacity-80"
                  />
                </div>
                <h3 className="text-lg sm:text-xl tracking-[-0.04em]">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm opacity-50 leading-relaxed tracking-[-0.04em] max-w-[280px]">
                  {item.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
