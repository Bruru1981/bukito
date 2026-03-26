"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "../components/FadeIn";

/* Placeholder playlists — will be Supabase-backed + Spotify embed later */
const playlists = [
  {
    id: "morning",
    title: "Morning Coffee",
    desc: "Slow Start, First Light, Espresso Machine Humming",
    trackCount: 42,
    duration: "2h 48m",
    mood: "Ambient / Acoustic / Jazz",
    spotifyUrl: "https://open.spotify.com/playlist/bukito-morning",
    color: "#6d0000",
  },
  {
    id: "afternoon",
    title: "Afternoon Session",
    desc: "Post-Surf, Cold Brew, Hammock Weather",
    trackCount: 38,
    duration: "2h 22m",
    mood: "Indie / Bossa / Chill",
    spotifyUrl: "https://open.spotify.com/playlist/bukito-afternoon",
    color: "#008134",
  },
  {
    id: "sunset",
    title: "Sunset Hour",
    desc: "Golden Light On The Water, Bintang In Hand",
    trackCount: 35,
    duration: "2h 15m",
    mood: "Deep House / Downtempo / Balearic",
    spotifyUrl: "https://open.spotify.com/playlist/bukito-sunset",
    color: "#6d0000",
  },
  {
    id: "dinner",
    title: "Dinner Service",
    desc: "Kitchen Heat, Low Conversation, Candle Flicker",
    trackCount: 44,
    duration: "3h 05m",
    mood: "Soul / Neo-Jazz / Electronic",
    spotifyUrl: "https://open.spotify.com/playlist/bukito-dinner",
    color: "#a8c8e8",
  },
];

function PlaylistCard({
  title,
  desc,
  trackCount,
  duration,
  mood,
  spotifyUrl,
  color,
  index,
}: (typeof playlists)[0] & { index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <FadeIn delay={index * 0.1}>
      <a
        href={spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block py-7 sm:py-9 border-t border-sand/8 relative overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Hover accent line */}
        <motion.div
          className="absolute left-0 top-0 w-[3px] h-full"
          style={{ backgroundColor: color }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: hovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
          {/* Number */}
          <span className="text-xs tracking-[0.15em] opacity-15 sm:w-16 shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* Title + desc */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl sm:text-2xl lg:text-3xl tracking-[-0.04em] group-hover:text-sand transition-colors">
              {title}
            </h3>
            <p
              className="text-xs tracking-[-0.01em] opacity-25 mt-1"
              style={{ fontFamily: "var(--font-kisrre-rounded)" }}
            >
              {desc}
            </p>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-5 sm:gap-8 shrink-0">
            <span className="text-[11px] tracking-[0.15em] opacity-15 hidden lg:block">
              {mood}
            </span>
            <span className="text-[11px] tracking-[0.1em] opacity-20">
              {trackCount} Tracks &bull; {duration}
            </span>
            {/* Spotify icon hint */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="opacity-20 group-hover:opacity-60 group-hover:translate-x-0.5 transition-all"
              aria-hidden="true"
            >
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </div>
        </div>
      </a>
    </FadeIn>
  );
}

export function PlaylistSection() {
  return (
    <section className="relative bg-black-magic text-sand overflow-hidden py-24 sm:py-32 px-8 sm:px-16 lg:px-20">
      <div className="noise absolute inset-0 pointer-events-none" />

      <div className="relative z-10 max-w-5xl">
        {/* Header */}
        <FadeIn className="mb-14 sm:mb-20">
          <p className="text-xs tracking-[0.25em] text-sand/25 mb-4">
            Curated By Alice
          </p>
          <h2 className="text-5xl sm:text-7xl lg:text-8xl tracking-[-0.05em] leading-[0.85]">
            Listen
          </h2>
          <p
            className="text-xs sm:text-sm tracking-[-0.01em] opacity-25 mt-5 max-w-[40ch]"
            style={{ fontFamily: "var(--font-kisrre-rounded)" }}
          >
            The Sounds We Play At Bukito. From First
            Coffee To Last Call.
          </p>
        </FadeIn>

        {/* Playlist rows */}
        <div>
          {playlists.map((pl, i) => (
            <PlaylistCard key={pl.id} {...pl} index={i} />
          ))}
          {/* Bottom border */}
          <div className="border-t border-sand/8" />
        </div>

        {/* CTA */}
        <FadeIn delay={0.3} className="mt-10 sm:mt-14">
          <a
            href="https://open.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-xs tracking-[0.15em] text-sand/30 hover:text-sand transition-colors"
          >
            Follow On Spotify
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
