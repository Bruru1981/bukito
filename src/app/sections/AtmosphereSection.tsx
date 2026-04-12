"use client";

import Image from "next/image";
import { AnimatedSection } from "../components/AnimatedSection";

const STORAGE =
  "https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/public/media/Bukito%20brand%20book";

export function AtmosphereSection() {
  return (
    <section className="relative py-32 sm:py-44 px-6 bg-sand text-sunrust overflow-hidden">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Text side */}
        <div>
          <AnimatedSection variant="fadeUp" delay={0}>
            <p className="text-[10px] sm:text-xs tracking-[0.2em] opacity-40 mb-6">
              After Dark
            </p>
          </AnimatedSection>

          <AnimatedSection variant="fadeUp" delay={0.15}>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl leading-[0.95] tracking-[-0.04em]">
              Night Coffee
              <br />
              And Jungle
              <br />
              Walks
            </h2>
          </AnimatedSection>

          <AnimatedSection variant="fadeUp" delay={0.3}>
            <div className="editorial-divider mt-8" />
          </AnimatedSection>

          <AnimatedSection variant="fadeUp" delay={0.45}>
            <p className="mt-8 text-sm sm:text-base leading-relaxed tracking-[-0.04em] opacity-60 max-w-md">
              When the sun drops behind Mount Tambora, Bukito
              transforms. String lights flicker. The kitchen
              heats up. Stories get told. This is where strangers
              become friends and friends become family.
            </p>
          </AnimatedSection>
        </div>

        {/* Logo side */}
        <AnimatedSection
          variant="scale"
          delay={0.3}
          className="flex flex-col items-center gap-8"
        >
          <Image
            src={`${STORAGE}/logos/BUKITO_LogoSnakeCoffee.png`}
            alt="BUKITO SNAKE COFFEE LOGO"
            width={280}
            height={280}
            className="w-[200px] sm:w-[280px] opacity-80"
          />
          <Image
            src={`${STORAGE}/wordmarks/BUKITO_WordmarkFaded.png`}
            alt="BUKITO"
            width={200}
            height={40}
            className="opacity-30"
          />
        </AnimatedSection>
      </div>
    </section>
  );
}
