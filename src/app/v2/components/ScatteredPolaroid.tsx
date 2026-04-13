"use client";

import { useMemo } from "react";
import Image from "next/image";
import { TiltPhoto } from "./TiltPhoto";

/** Photos that work well as small decorative polaroids — warm, atmospheric, textured */
const POLAROID_POOL = [
  "/photos/BUKITO_IG1.webp",
  "/photos/BUKITO_IG3.webp",
  "/photos/BUKITO_IG4.webp",
  "/photos/BUKITO_IG5.webp",
  "/photos/BUKITO_IG8.webp",
  "/photos/BUKITO_IG9.webp",
  "/photos/BUKITO_IG10.webp",
  "/photos/BUKITO_IG13.webp",
  "/photos/BUKITO_IG14.webp",
  "/photos/BUKITO_IG16.webp",
  "/photos/BUKITO_IG17.webp",
  "/photos/BUKITO_IG20.webp",
  "/photos/BUKITO_IG21.webp",
  "/photos/BUKITO_IG25.webp",
  "/photos/bukito-barista.webp",
  "/photos/chef-ragil.webp",
];

type Props = {
  /** Stable seed so the same slot always picks the same photo per page load */
  seed?: number;
  /** Photo dimensions — default is 220x280 (the "bigger" size) */
  width?: number;
  height?: number;
  /** CSS rotation in degrees */
  rotate?: number;
  /** Opacity (0–1) */
  opacity?: number;
  /** Extra classes on the outer wrapper */
  className?: string;
  /** Max tilt angle */
  maxTilt?: number;
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function ScatteredPolaroid({
  seed = 0,
  width = 220,
  height = 280,
  rotate = 3,
  opacity = 0.25,
  className = "",
  maxTilt = 5,
}: Props) {
  const photo = useMemo(() => {
    const idx = Math.floor(seededRandom(seed) * POLAROID_POOL.length);
    return POLAROID_POOL[idx];
  }, [seed]);

  return (
    <TiltPhoto maxTilt={maxTilt} className={`transition-opacity duration-500 hover:opacity-[0.5] ${className}`}>
      <div
        className="relative overflow-hidden ring-1 ring-current/10 shadow-xl"
        style={{
          width,
          height,
          opacity,
          transform: `rotate(${rotate}deg)`,
        }}
      >
        <Image
          src={photo}
          alt=""
          fill
          className="object-cover"
          sizes={`${width}px`}
          aria-hidden="true"
        />
      </div>
    </TiltPhoto>
  );
}
