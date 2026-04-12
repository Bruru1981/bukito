"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type PointerEvent,
} from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { FadeIn } from "../../components/FadeIn";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Visual scale (−25% from 1.44). */
const SNAKE_SCALE = 1.44 * 0.75;

/*
  Serpent PNG: head / tongue top-right, tail bottom. Rotated so tail → Bali,
  head → Bukito. Labels sit on the body; Bukito sits just under the mouth.

  pathDebug: /v2?pathDebug=1 — tap the map. Coords use a strict square (padding
  lives outside that box) so phone and desktop percentages match the same spot.
*/

type JourneyStop = {
  name: string;
  detail: string;
  /** Emoji / symbol; omit for destinations with no mark (e.g. Bukito). */
  icon?: string;
  /** Position in the map square (snake layer underneath) */
  top: string;
  left: string;
  /** Optional CSS transform for fine placement */
  transform?: string;
  /** Bukito block stacks under the tongue exit */
  layout?: "body" | "below-mouth";
};

const locations: JourneyStop[] = [
  {
    name: "Bali",
    detail: "Fly in",
    icon: "✈",
    top: "30%",
    left: "17%",
    layout: "body",
  },
  {
    name: "Lombok",
    detail: "Fly or ferry",
    icon: "✈",
    top: "53%",
    left: "24%",
    layout: "body",
  },
  {
    name: "Sumbawa",
    detail: "Ferry, 2h",
    icon: "⛴",
    top: "26%",
    left: "57%",
    layout: "body",
  },
  {
    name: "Kertasari",
    detail: "Ride west, 45 min",
    icon: "🏍",
    top: "78%",
    left: "43%",
    layout: "body",
  },
  {
    name: "Bukito",
    detail: "Follow the snake",
    top: "87%",
    left: "78%",
    layout: "below-mouth",
  },
];

const LABEL_PANEL =
  "rounded-lg border border-sand/20 bg-black-magic/78 px-3 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.55)] ring-1 ring-wavy-blue/10 backdrop-blur-md sm:px-4 sm:py-3";

export function PathScene() {
  const ref = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });
  const [pathDebug, setPathDebug] = useState(false);
  const [debugSnippet, setDebugSnippet] = useState<string | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("pathDebug");
    setPathDebug(q === "1" || q === "true");
  }, []);

  const captureMapPoint = useCallback((clientX: number, clientY: number) => {
    const el = mapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const w = r.width;
    const h = r.height;
    const leftPct = ((clientX - r.left) / w) * 100;
    const topPct = ((clientY - r.top) / h) * 100;
    const skewPx = Math.abs(w - h);
    const clean = `top: "${topPct.toFixed(1)}%", left: "${leftPct.toFixed(1)}%"`;
    setDebugSnippet(
      skewPx > 2
        ? `${clean} — map ${w.toFixed(0)}×${h.toFixed(0)}px (not square)`
        : clean,
    );
    console.info("[pathDebug]", { topPct, leftPct, w, h, skewPx });
    void navigator.clipboard?.writeText(clean).catch(() => {});
  }, []);

  const onMapDebugPointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      captureMapPoint(e.clientX, e.clientY);
    },
    [captureMapPoint],
  );

  return (
    <section
      ref={ref}
      className="relative bg-black-magic text-sand overflow-x-clip overflow-y-visible py-24 sm:py-32 lg:py-40 px-4 sm:px-12 lg:px-16"
    >
      <div className="noise absolute inset-0 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <FadeIn className="mb-16 sm:mb-24">
          <p className="text-xs tracking-[0.25em] text-sand/25 mb-5">
            How To Find Us
          </p>
          <h2 className="text-[clamp(2.5rem,8vw,5.5rem)] tracking-[-0.05em] leading-[0.85]">
            The
            <br />
            Journey
          </h2>
          <p className="mt-6 text-sm tracking-[0.1em] text-sand/35">
            Near Lakey Peak, Sumbawa Barat
          </p>
          <div
            className="mx-auto mt-8 h-px w-20 bg-gradient-to-r from-transparent via-wavy-blue/35 to-transparent sm:mx-0 sm:w-28"
            aria-hidden="true"
          />
        </FadeIn>

        {/* Outer wrap: spacing only. Inner motion div is a strict square — ref
            must not include vertical padding or aspect breaks and % differ by device. */}
        <div className="relative mx-auto w-full max-w-[min(92vw,920px)] pb-8 sm:pb-12">
          <motion.div
            ref={mapRef}
            className="relative aspect-square w-full overflow-visible"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, ease: EASE }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center overflow-visible"
              style={{
                transform: `rotate(112deg) scale(${SNAKE_SCALE})`,
                transformOrigin: "center center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/public/media/Bukito%20brand%20book/icons/BUKITO_Icon_Serpent.png"
                alt="Snake path: tail at Bali, head at Bukito"
                className="h-full w-full object-contain"
                style={{
                  filter: "invert(1) brightness(0.88) sepia(0.12)",
                  opacity: 0.32,
                }}
              />
            </div>

            {locations.map((loc, i) => {
              const isLast = loc.layout === "below-mouth";

              return (
                <motion.div
                  key={loc.name}
                  className={`absolute flex ${
                    isLast
                      ? "flex-col items-center gap-2 text-center"
                      : "flex-row items-center gap-2 sm:gap-3"
                  }`}
                  style={{
                    top: loc.top,
                    left: loc.left,
                    transform: loc.transform,
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.8 + i * 0.3,
                    ease: EASE,
                  }}
                >
                  {!isLast && (
                    <div
                      className="h-2.5 w-2.5 shrink-0 self-center rounded-full bg-sand/40 sm:h-3 sm:w-3"
                      aria-hidden="true"
                    />
                  )}

                  <div
                    className={`${LABEL_PANEL} ${
                      isLast
                        ? "flex max-w-[min(92vw,16rem)] flex-col items-center gap-1 text-center"
                        : "flex max-w-[min(92vw,20rem)] items-center gap-3 sm:gap-4"
                    }`}
                  >
                    {loc.icon ? (
                      <span
                        className="select-none text-4xl leading-none sm:text-5xl lg:text-6xl"
                        style={{
                          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
                        }}
                        aria-hidden="true"
                      >
                        {loc.icon}
                      </span>
                    ) : null}
                    <div
                      className={
                        isLast
                          ? "flex flex-col items-center gap-0.5"
                          : "min-w-0"
                      }
                    >
                      <p
                        className={`tracking-[-0.03em] text-sand ${
                          isLast
                            ? "text-lg sm:text-xl lg:text-2xl"
                            : "whitespace-nowrap text-sm sm:text-base lg:text-lg"
                        }`}
                      >
                        {loc.name}
                      </p>
                      <p
                        className={`tracking-[0.05em] text-sand/60 sm:mt-0.5 ${
                          isLast
                            ? "max-w-[14rem] text-center text-[11px] sm:text-xs"
                            : "whitespace-nowrap text-[11px] sm:text-xs"
                        }`}
                        style={{ fontFamily: "var(--font-kisrre-rounded)" }}
                      >
                        {loc.detail}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {pathDebug && (
              <>
                <button
                  type="button"
                  onPointerDown={onMapDebugPointerDown}
                  className="absolute inset-0 z-20 cursor-crosshair touch-manipulation rounded-lg border-2 border-dashed border-jungle/50 bg-transparent"
                  aria-label="Path debug: tap to copy top and left percentages"
                />
                <div
                  className="pointer-events-none absolute bottom-1 left-1/2 z-30 max-w-[min(100%,24rem)] -translate-x-1/2 rounded border border-jungle/40 bg-black-magic/90 px-3 py-2 text-center text-[10px] text-sand/90 sm:text-[11px]"
                  style={{ fontFamily: "var(--font-kisrre-rounded)" }}
                >
                  <p className="tracking-[0.08em] text-jungle">pathDebug=1</p>
                  <p className="mt-1 opacity-80">
                    Tap inside dashed square — same % on phone &amp; desktop
                  </p>
                  {debugSnippet && (
                    <p className="mt-2 break-all font-mono text-[9px] text-sand/70">
                      {debugSnippet}
                    </p>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </div>

        <FadeIn
          delay={0.12}
          className="mx-auto mt-14 w-full max-w-[min(92vw,920px)] sm:mt-16"
        >
          <p className="text-xs tracking-[0.2em] text-sand/15 mb-4 sm:mb-5">
            Map
          </p>
          <div className="overflow-hidden rounded-lg border border-sand/10 bg-sand/[0.04] ring-1 ring-white/[0.04]">
            <Image
              src="/images/kertasari-map.png"
              alt="Kertasari coastal map with Bukito seal and shoreline"
              width={676}
              height={802}
              className="h-auto w-full object-cover"
              sizes="(max-width: 768px) 92vw, 920px"
            />
          </div>
        </FadeIn>

        {/* Coordinates + Maps */}
        <FadeIn
          delay={0.3}
          className="mt-20 sm:mt-28 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8"
        >
          <div>
            <p className="text-xs tracking-[0.2em] text-sand/15 mb-2">
              Coordinates
            </p>
            <p className="text-lg sm:text-2xl tracking-[-0.02em] text-sand/40">
              8&deg;33&apos;S &bull; 116&deg;47&apos;E
            </p>
          </div>
          <a
            href="https://www.google.com/maps?q=-8.55,116.783"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-xs tracking-[0.1em] text-sand/40 hover:text-sand transition-colors active:scale-[0.97] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black-magic"
          >
            Open In Maps
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              aria-hidden="true"
            >
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
