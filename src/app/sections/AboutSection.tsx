"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { FadeIn } from "../components/FadeIn";

const STORAGE =
  "https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/public/media/Bukito%20brand%20book";

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={ref}
      className="relative bg-black-magic text-sand overflow-hidden"
    >
      <div className="noise absolute inset-0 pointer-events-none" />

      {/* Split layout */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Left — text */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 xl:px-28 py-28 sm:py-40">
          {/* Snake logo watermark */}
          <div className="absolute top-16 left-8 sm:left-16 lg:left-20 opacity-[0.04] pointer-events-none">
            <Image
              src={`${STORAGE}/logos/BUKITO_LogoSnakePalm.png`}
              alt=""
              width={180}
              height={180}
              className="invert"
              aria-hidden="true"
            />
          </div>

          <FadeIn>
            <p className="text-xs tracking-[0.25em] text-sand/40 mb-8">
              Est. Kertasari
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-[-0.05em] leading-[0.9] mb-10 sm:mb-14">
              Where The
              <br />
              Jungle Meets
              <br />
              The Sea
            </h2>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="w-12 h-[1px] bg-sand/15 mb-8" />
          </FadeIn>

          <FadeIn delay={0.4}>
            <p
              className="text-xs sm:text-sm tracking-[-0.01em] leading-relaxed opacity-50 max-w-[38ch]"
              style={{ fontFamily: "var(--font-kisrre-rounded)" }}
            >
              Hidden in the palmgroves of Kertasari, Sumbawa Barat. Coffee & Restaurant. Come hang, chill, work, or wash off the salt. Connect with other travellers or just let our staff take care of you. We've got you covered with the most delicious food and drinks. Bukito is your living room in Kertasari. Open daily from 7:30am · Closed Tuesday
          
            </p>
          </FadeIn>
        </div>

        {/* Right — full-height photo */}
        <div className="relative lg:w-[45%] h-[60vh] lg:h-auto overflow-hidden">
          <motion.div className="absolute inset-0" style={{ y: photoY }}>
            <Image
              src="/photos/BUKITO_IG19.webp"
              alt="View from Bukito restaurant overlooking the Sumbawa coastline and ocean"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-black-magic/20" />
        </div>
      </div>
    </section>
  );
}
