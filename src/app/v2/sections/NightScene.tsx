"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "../../components/FadeIn";
import { TiltPhoto } from "../components/TiltPhoto";
import { supabaseGet } from "../../../lib/supabase-fetch";
import { resolveBrandPhoto } from "../../../lib/brand-media";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  dateTime: string;
  image: string;
  alt: string;
};

type Playlist = {
  id: string;
  title: string;
  desc: string;
  tracks: number;
  duration: string;
  color: string;
  url: string;
};

/** DB row from blog_posts (Supabase REST) */
type DbPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  published_at: string;
  image_url: string;
};

/** DB row from playlists */
type DbPlaylist = {
  id: string;
  title: string;
  description: string;
  track_count: number;
  duration: string;
  spotify_url: string;
  color: string;
  sort_order: number;
};

function formatPostDate(isoDate: string): { date: string; dateTime: string } {
  const d = new Date(isoDate);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return {
    date: `${months[d.getMonth()]} ${d.getFullYear()}`,
    dateTime: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
  };
}

const FALLBACK_POSTS: Post[] = [
  {
    slug: "kl-food-crawl",
    title: "KL Food Crawl",
    excerpt: "Three Days Eating Through Kuala Lumpur's Best Hawker Stalls",
    category: "On The Road",
    date: "Mar 2026",
    dateTime: "2026-03",
    image: resolveBrandPhoto("BUKITO_IG12.webp"),
    alt: "Street food scene in Kuala Lumpur",
  },
  {
    slug: "sourdough-sumbawa",
    title: "Making Sourdough On A Tropical Island",
    excerpt: "Why Humidity Is Both The Enemy And The Secret",
    category: "Kitchen Notes",
    date: "Feb 2026",
    dateTime: "2026-02",
    image: resolveBrandPhoto("BUKITO_IG1.webp"),
    alt: "Sourdough at Bukito kitchen",
  },
  {
    slug: "lakey-peak-guide",
    title: "A Surfer's Guide To Lakey Peak",
    excerpt: "The Waves, The Lineup, And Where To Eat After",
    category: "Sumbawa Life",
    date: "Jan 2026",
    dateTime: "2026-01",
    image: resolveBrandPhoto("BUKITO_IG24.webp"),
    alt: "Sunset at Lakey Peak",
  },
];

/** Floating tilt prints around the Listen column (large screens). */
const PLAYLIST_TILT_DECOR = [
  {
    src: "/photos/bukito-barista.webp",
    alt: "Barista pulling espresso at Bukito",
    w: 136,
    h: 172,
    className: "absolute right-0 top-2 z-[5] -translate-x-1 rotate-[-5deg]",
    maxTilt: 4 as const,
  },
  {
    src: "/photos/BUKITO_IG22.webp",
    alt: "Sumbawa coastline near Kertasari",
    w: 212,
    h: 118,
    className: "absolute right-1 bottom-28 z-[5] translate-x-2 rotate-[2deg]",
    maxTilt: 4 as const,
  },
  {
    src: "/photos/BUKITO_IG10.webp",
    alt: "Coffee and light at Bukito",
    w: 128,
    h: 168,
    className: "absolute left-0 bottom-6 z-[5] -translate-x-3 rotate-[4deg]",
    maxTilt: 5 as const,
  },
] as const;

const FALLBACK_PLAYLISTS: Playlist[] = [
  {
    id: "morning",
    title: "Morning Coffee",
    desc: "Slow Start, First Light",
    tracks: 42,
    duration: "2h 48m",
    color: "#6D0000",
    url: "https://open.spotify.com",
  },
  {
    id: "afternoon",
    title: "Afternoon Session",
    desc: "Post-Surf, Cold Brew",
    tracks: 38,
    duration: "2h 22m",
    color: "#008134",
    url: "https://open.spotify.com",
  },
  {
    id: "sunset",
    title: "Sunset Hour",
    desc: "Golden Light, Bintang In Hand",
    tracks: 35,
    duration: "2h 15m",
    color: "#E67E32",
    url: "https://open.spotify.com",
  },
  {
    id: "dinner",
    title: "Dinner Service",
    desc: "Kitchen Heat, Candle Flicker",
    tracks: 44,
    duration: "3h 05m",
    color: "#A8C8E8",
    url: "https://open.spotify.com",
  },
];

export function NightScene() {
  const [posts, setPosts] = useState<Post[]>(FALLBACK_POSTS);
  const [playlists, setPlaylists] = useState<Playlist[]>(FALLBACK_PLAYLISTS);
  const [hoveredPlaylist, setHoveredPlaylist] = useState<string | null>(null);
  const activeColor = playlists.find((p) => p.id === hoveredPlaylist)?.color;

  useEffect(() => {
    // Fetch blog posts
    supabaseGet<DbPost[]>(
      "blog_posts?status=eq.published&order=published_at.desc&limit=3",
    ).then((data) => {
      if (data && data.length > 0) {
        setPosts(
          data.map((p) => {
            const { date, dateTime } = formatPostDate(p.published_at);
            return {
              slug: p.slug,
              title: p.title,
              excerpt: p.excerpt,
              category: p.category,
              date,
              dateTime,
              image: resolveBrandPhoto(p.image_url),
              alt: p.title,
            };
          }),
        );
      }
    });

    // Fetch playlists
    supabaseGet<DbPlaylist[]>("playlists?order=sort_order").then((data) => {
      if (data && data.length > 0) {
        setPlaylists(
          data.map((pl) => ({
            id: pl.id,
            title: pl.title,
            desc: pl.description,
            tracks: pl.track_count,
            duration: pl.duration,
            color: pl.color,
            url: pl.spotify_url,
          })),
        );
      }
    });
  }, []);

  return (
    <section className="relative overflow-hidden bg-black-magic text-sand">
      <div className="noise absolute inset-0 pointer-events-none" />

      {/* Playlist hover wash — radial gradient, NOT side-stripe */}
      <AnimatePresence>
        {activeColor && (
          <motion.div
            key={hoveredPlaylist}
            className="pointer-events-none absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.07 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{
              background: `radial-gradient(ellipse at 70% 50%, ${activeColor} 0%, transparent 65%)`,
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 px-8 py-24 sm:px-16 sm:py-32 lg:grid lg:grid-cols-5 lg:gap-16 lg:px-20 lg:py-40">
        {/* LEFT: Stories (3 cols) */}
        <div className="lg:col-span-3">
          <FadeIn>
            <p className="text-[11px] tracking-[0.25em] text-sand/25 mb-3">
              Stories From The Road And The Kitchen
            </p>
            <h2 className="text-[clamp(2.5rem,7vw,5rem)] leading-[0.85] tracking-[-0.05em] mb-12 sm:mb-16">
              Journal
            </h2>
          </FadeIn>

          {/* Featured post */}
          <FadeIn delay={0.1}>
            <Link href={`/v2/journal/${posts[0].slug}`} className="block">
              <article className="group relative mb-8 cursor-pointer">
                <div className="relative h-[280px] sm:h-[360px] overflow-hidden hover-ken-burns">
                  <Image
                    src={posts[0].image}
                    alt={posts[0].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  <div className="noise absolute inset-0 pointer-events-none" />
                  <span
                    className="absolute right-4 top-2 text-[120px] sm:text-[150px] leading-none text-sand/[0.02] pointer-events-none select-none"
                    aria-hidden="true"
                  >
                    01
                  </span>
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black-magic/80 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[11px] tracking-[0.2em] text-sand/40">
                      {posts[0].category}
                    </span>
                    <h3 className="mt-1 text-xl sm:text-2xl tracking-[-0.04em]">
                      {posts[0].title}
                    </h3>
                  </div>
                </div>
              </article>
            </Link>
          </FadeIn>

          {/* Two smaller posts */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {posts.slice(1).map((post, i) => (
              <FadeIn key={post.slug} delay={0.15 + i * 0.08}>
                <Link href={`/v2/journal/${post.slug}`} className="block">
                  <article className="group cursor-pointer">
                    <div className="relative h-[160px] sm:h-[200px] overflow-hidden hover-ken-burns">
                      <Image
                        src={post.image}
                        alt={post.alt}
                        fill
                        className="object-cover"
                        sizes="30vw"
                      />
                      <div className="noise absolute inset-0 pointer-events-none" />
                      <span
                        className="absolute right-3 top-1 text-[80px] leading-none text-sand/[0.02] pointer-events-none select-none"
                        aria-hidden="true"
                      >
                        {String(i + 2).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="mt-3">
                      <span className="text-[11px] tracking-[0.15em] text-sand/30">
                        {post.category}
                      </span>
                      <h3 className="mt-1 text-sm tracking-[-0.03em] sm:text-base">
                        {post.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Cat photo — 3D tilt, decorative */}
        <FadeIn
          delay={0.25}
          className="hidden lg:block lg:col-span-2 lg:col-start-4 lg:row-start-2 self-end"
        >
          <TiltPhoto className="w-[160px]">
            <div className="relative h-[200px] w-[160px] overflow-hidden -rotate-3">
              <Image
                src={resolveBrandPhoto("BUKITO_IG3.webp")}
                alt="Cat at Bukito"
                fill
                className="object-cover"
              />
            </div>
          </TiltPhoto>
        </FadeIn>

        {/* RIGHT: Playlists (2 cols) */}
        <div className="relative mt-16 lg:col-span-2 lg:mt-0 lg:min-h-[28rem] lg:pt-12">
          <div
            className="pointer-events-none absolute inset-0 z-[5] hidden overflow-visible lg:block"
            aria-hidden="true"
          >
            {PLAYLIST_TILT_DECOR.map((d) => (
              <div key={d.src} className={`pointer-events-auto ${d.className}`}>
                <TiltPhoto maxTilt={d.maxTilt} className="shadow-[0_14px_48px_rgba(0,0,0,0.5)]">
                  <div
                    className="relative overflow-hidden ring-1 ring-sand/15"
                    style={{ width: d.w, height: d.h }}
                  >
                    <Image
                      src={d.src}
                      alt={d.alt}
                      fill
                      className="object-cover"
                      sizes="220px"
                    />
                  </div>
                </TiltPhoto>
              </div>
            ))}
          </div>

          <div className="relative z-10">
          <FadeIn>
            <p className="text-[11px] tracking-[0.25em] text-sand/25 mb-3">
              What We Play Here
            </p>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] leading-[0.85] tracking-[-0.05em] mb-10">
              Listen
            </h2>
            <p
              className="text-xs opacity-25 mb-10 max-w-[30ch]"
              style={{ fontFamily: "var(--font-kisrre-rounded)" }}
            >
              The Sounds We Play At Bukito. From First Coffee To Last Call.
            </p>
          </FadeIn>

          {playlists.map((pl, i) => (
            <FadeIn key={pl.id} delay={0.1 + i * 0.06}>
              <a
                href={pl.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block border-t border-sand/8 py-5 cursor-pointer active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black-magic"
                onMouseEnter={() => setHoveredPlaylist(pl.id)}
                onMouseLeave={() => setHoveredPlaylist(null)}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base tracking-[-0.03em] sm:text-lg group-hover:text-sand transition-colors">
                      {pl.title}
                    </h3>
                    <p
                      className="text-[11px] opacity-20 mt-0.5"
                      style={{ fontFamily: "var(--font-kisrre-rounded)" }}
                    >
                      {pl.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-[11px] tracking-[0.1em] opacity-15 hidden sm:block">
                      {pl.tracks} &middot; {pl.duration}
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="opacity-15 group-hover:opacity-40 group-hover:translate-x-0.5 transition-[opacity,transform]"
                      aria-hidden="true"
                    >
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </div>
                </div>
              </a>
            </FadeIn>
          ))}
          <div className="border-t border-sand/8" />
          </div>
        </div>
      </div>
    </section>
  );
}
