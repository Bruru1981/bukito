"use client";

import Image from "next/image";
import { FadeIn } from "../components/FadeIn";

const STORAGE =
  "https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/public/media/Bukito%20brand%20book";

export function FooterSection() {
  return (
    <footer className="relative bg-black-magic text-sand overflow-hidden py-32 sm:py-44 px-8 sm:px-16">
      {/* Pattern texture background */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: "url(/BUKITO_Pattern.png)", backgroundSize: "300px" }}
      />
      <div className="noise absolute inset-0 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Snake logo — large, the hero of the footer */}
        <FadeIn>
          <Image
            src={`${STORAGE}/logos/BUKITO_LogoSnakePalm.png`}
            alt="Bukito snake palm logo"
            width={200}
            height={200}
            className="mx-auto invert opacity-40"
          />
        </FadeIn>

        {/* Address — single elegant block */}
        <FadeIn delay={0.2}>
          <address className="mt-14 sm:mt-20 not-italic">
            <p className="text-xs sm:text-sm tracking-[-0.02em] opacity-40 leading-relaxed">
              Jl. Pantai Kertasari
              <br />
              Sumbawa Besar, Nusa Tenggara Barat
              <br />
              Indonesia
            </p>
          </address>
        </FadeIn>

        {/* Links — one line */}
        <FadeIn delay={0.3}>
          <div className="mt-10 flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
            <a
              href="https://instagram.com/bukito.sumbawa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-[0.1em] opacity-30 hover:opacity-80 transition-opacity"
            >
              Instagram
            </a>
            <span className="opacity-10">/</span>
            <a
              href="https://tiktok.com/@bukito.sumbawa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-[0.1em] opacity-30 hover:opacity-80 transition-opacity"
            >
              TikTok
            </a>
            <span className="opacity-10">/</span>
            <a
              href="https://wa.me/6282234606010"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-[0.1em] opacity-30 hover:opacity-80 transition-opacity"
            >
              WhatsApp
            </a>
          </div>
        </FadeIn>

        {/* Open daily */}
        <FadeIn delay={0.4}>
          <p className="mt-14 text-xs tracking-[0.25em] opacity-15">
            Open Daily
          </p>
        </FadeIn>

        {/* Whisper text */}
        <FadeIn delay={0.5}>
          <p className="mt-20 text-[11px] tracking-[0.2em] opacity-10">
            #ParadiseWithFangs
          </p>
          <p className="mt-3 text-[11px] tracking-[0.15em] opacity-[0.07]">
            &copy; 2026 Bukito
          </p>
        </FadeIn>
      </div>
    </footer>
  );
}
