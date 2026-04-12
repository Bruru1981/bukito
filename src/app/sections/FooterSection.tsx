"use client";

import { useState } from "react";
import Image from "next/image";
import { FadeIn } from "../components/FadeIn";
import {
  BUKITO_STAMP_DISTORTED_SUPABASE,
  BUKITO_STAMP_SUPABASE,
} from "../../lib/brand-media";

const STAMP_LOCAL = "/BUKITO_StampDistorted.png";

export function FooterSection() {
  const [stampSrc, setStampSrc] = useState(BUKITO_STAMP_SUPABASE);

  function onStampError() {
    if (stampSrc === BUKITO_STAMP_SUPABASE) {
      setStampSrc(BUKITO_STAMP_DISTORTED_SUPABASE);
      return;
    }
    if (stampSrc === BUKITO_STAMP_DISTORTED_SUPABASE) {
      setStampSrc(STAMP_LOCAL);
    }
  }

  return (
    <footer className="relative overflow-hidden bg-black-magic px-8 py-32 text-sand sm:px-16 sm:py-44">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "url(/BUKITO_Pattern.png)",
          backgroundSize: "300px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 noise" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <FadeIn>
          <a
            href={BUKITO_STAMP_SUPABASE}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black-magic"
            style={{
              /* Black artwork → sand/white on dark footer (works even when Next wraps the img). */
              filter: "brightness(0) invert(1) brightness(1.12)",
            }}
          >
            <Image
              src={stampSrc}
              alt="Bukito stamp — Kertasari, Sumbawa Barat"
              width={240}
              height={240}
              unoptimized
              onError={onStampError}
              className="block h-auto w-[min(200px,48vw)] opacity-95 transition-opacity group-hover:opacity-100"
            />
          </a>
        </FadeIn>
        <FadeIn delay={0.06}>
          <p className="mt-4 text-[11px] tracking-[0.2em] text-sand/35">
            <a
              href={BUKITO_STAMP_SUPABASE}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-sand/20 underline-offset-4 transition-colors hover:text-sand/70 hover:decoration-sand/40"
            >
              Brand book (Supabase)
            </a>
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <address className="mt-14 not-italic sm:mt-16">
            <p className="text-xs leading-relaxed tracking-[-0.02em] text-sand/50 sm:text-sm">
              Jl. Pantai Kertasari
              <br />
              Sumbawa Besar, Nusa Tenggara Barat
              <br />
              Indonesia
            </p>
          </address>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a
              href="https://instagram.com/bukito.sumbawa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-[0.1em] text-sand/35 transition-opacity hover:text-sand/85"
            >
              Instagram
            </a>
            <span className="text-sand/12">/</span>
            <a
              href="https://tiktok.com/@bukito.sumbawa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-[0.1em] text-sand/35 transition-opacity hover:text-sand/85"
            >
              TikTok
            </a>
            <span className="text-sand/12">/</span>
            <a
              href="https://wa.me/6282234606010"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-[0.1em] text-sand/35 transition-opacity hover:text-sand/85"
            >
              WhatsApp
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.35}>
          <p className="mt-14 text-xs tracking-[0.25em] text-sand/20">
            Open Daily
          </p>
        </FadeIn>

        <FadeIn delay={0.45}>
          <p className="mt-20 text-[11px] tracking-[0.2em] text-sand/12">
            #ParadiseWithFangs
          </p>
          <p className="mt-3 text-[11px] tracking-[0.15em] text-sand/10">
            &copy; 2026 Bukito
          </p>
        </FadeIn>
      </div>
    </footer>
  );
}
