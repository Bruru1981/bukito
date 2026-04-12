"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FadeIn } from "../../components/FadeIn";
import { fetchSiteSetting } from "../../../lib/supabase-fetch";
import {
  BUKITO_STAMP_DISTORTED_SUPABASE,
  BUKITO_STAMP_SUPABASE,
} from "../../../lib/brand-media";

type DayHours = { day: string; opens: string; closes: string; closed: boolean };
type HoursData = { days: DayHours[] };

function formatHoursText(hours: HoursData | null): string {
  if (!hours?.days) return "Open Daily 08:00 — 22:00";
  const closedDays = hours.days.filter((d) => d.closed).map((d) => d.day);
  const openDays = hours.days.filter((d) => !d.closed);
  if (openDays.length === 0) return "Temporarily Closed";
  const opens = openDays[0].opens;
  const closes = openDays[0].closes;
  if (closedDays.length === 0) return `Open Daily ${opens} — ${closes}`;
  return `${opens} — ${closes} · Closed ${closedDays.join(", ")}`;
}

const STAMP_LOCAL = "/BUKITO_StampDistorted.png";

/** Black / dark PNG → light mark on `bg-black-magic` */
const STAMP_LIGHT_FILTER = "brightness(0) invert(1) brightness(1.12)";

type ContactData = {
  address: string;
  region: string;
  hours: string;
  phone: string;
  whatsapp: string;
  tagline: string;
  hashtag: string;
};

type SocialLink = { label: string; url: string };
type SocialData = { links: SocialLink[] };

const FALLBACK_CONTACT: ContactData = {
  address: "Jl. Pantai Kertasari",
  region: "Sumbawa Barat, Nusa Tenggara Barat, Indonesia",
  hours: "Open Daily 08:00 \u2014 22:00",
  phone: "+62 822 3460 6010",
  whatsapp: "https://wa.me/6282234606010",
  tagline: "Once You\u2019re In You Will Stay",
  hashtag: "#ParadiseWithFangs",
};

const FALLBACK_SOCIAL: SocialData = {
  links: [
    { label: "Instagram", url: "https://instagram.com/bukito.sumbawa" },
    { label: "TikTok", url: "https://tiktok.com/@bukito.sumbawa" },
    { label: "WhatsApp", url: "https://wa.me/6282234606010" },
  ],
};

export function SealScene() {
  const [contact, setContact] = useState<ContactData>(FALLBACK_CONTACT);
  const [social, setSocial] = useState<SocialData>(FALLBACK_SOCIAL);
  const [hoursText, setHoursText] = useState("Open Daily 08:00 — 22:00");
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

  useEffect(() => {
    fetchSiteSetting<ContactData>("contact").then((data) => {
      if (data) setContact({ ...FALLBACK_CONTACT, ...data });
    });
    fetchSiteSetting<SocialData>("social").then((data) => {
      if (data) setSocial({ ...FALLBACK_SOCIAL, ...data });
    });
    fetchSiteSetting<HoursData>("hours").then((data) => {
      setHoursText(formatHoursText(data));
    });
  }, []);

  return (
    <section className="relative overflow-hidden bg-black-magic text-sand">
      <div className="noise absolute inset-0 pointer-events-none" />

      <div className="relative z-10 px-8 py-24 sm:px-16 sm:py-32 lg:px-20 lg:py-40">
        {/* Stamp only — Snake Palm mark removed per request */}
        <FadeIn className="mb-14 flex flex-col items-center justify-center sm:mb-20">
          <a
            href={BUKITO_STAMP_SUPABASE}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block h-48 w-48 shrink-0 sm:h-56 sm:w-56 lg:h-64 lg:w-64"
            style={{ filter: STAMP_LIGHT_FILTER }}
          >
            <Image
              src={stampSrc}
              alt="Bukito stamp — Kertasari, Sumbawa Barat"
              fill
              className="object-contain"
              unoptimized
              onError={onStampError}
              sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 256px"
            />
          </a>
        </FadeIn>

        {/* Content — wider layout, more readable */}
        <div className="max-w-lg mx-auto text-center">
          {/* Address */}
          <FadeIn>
            <p className="text-sm sm:text-base tracking-[0.1em] opacity-50">
              {contact.address}
            </p>
            <p className="mt-1 text-xs tracking-[0.08em] opacity-30">
              {contact.region}
            </p>
          </FadeIn>

          {/* Hours */}
          <FadeIn delay={0.1} className="mt-6">
            <p className="text-sm tracking-[0.12em] opacity-45">
              {hoursText}
            </p>
          </FadeIn>

          {/* Social links */}
          <FadeIn delay={0.15} className="mt-10">
            <nav
              aria-label="Social links"
              className="flex items-center justify-center gap-4 sm:gap-6"
            >
              {social.links.map((link, i) => (
                <span key={link.label} className="contents">
                  {i > 0 && (
                    <span className="text-xs opacity-15" aria-hidden="true">
                      &middot;
                    </span>
                  )}
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm tracking-[0.1em] opacity-40 hover:opacity-70 transition-opacity active:scale-[0.97] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black-magic"
                  >
                    {link.label}
                  </a>
                </span>
              ))}
            </nav>
          </FadeIn>

          {/* Phone */}
          <FadeIn delay={0.2} className="mt-6">
            <p className="text-xs tracking-[0.08em] opacity-30">
              {contact.phone}
            </p>
          </FadeIn>

          {/* Copyright */}
          <FadeIn delay={0.25} className="mt-10">
            <p className="text-xs tracking-[0.08em] opacity-15">
              &copy; 2024 &mdash; 2026 Bukito
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
