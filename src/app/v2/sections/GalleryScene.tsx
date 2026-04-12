"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { TiltPhoto } from "../components/TiltPhoto";
import { FadeIn } from "../../components/FadeIn";
import { fetchSiteSetting } from "../../../lib/supabase-fetch";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type GalleryHeader = {
  label: string;
  heading: string;
};

const FALLBACK_GALLERY_HEADER: GalleryHeader = {
  label: "Mornings, Surf, Sunsets, Repeat",
  heading: "Days Like These",
};

const STORAGE_BASE =
  "https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/public/media/Bukito%20brand%20book/photos";

/* Fallback photos (used while Supabase loads or if fetch fails) */
const FALLBACK_PHOTOS: { file: string; alt: string }[] = [
  { file: "BUKITO_IG7.webp", alt: "Jungle road leading to Bukito restaurant in Kertasari, Sumbawa" },
  { file: "BUKITO_IG3.webp", alt: "Cat lounging at Bukito cafe near Lakey Peak" },
  { file: "BUKITO_IG1.webp", alt: "Fresh sourdough at Bukito kitchen, Sumbawa" },
  { file: "BUKITO_IG19.webp", alt: "Tropical plants and warm light at Bukito restaurant" },
  { file: "BUKITO_IG22.webp", alt: "Coastline near Lakey Peak, Sumbawa" },
  { file: "BUKITO_IG11.webp", alt: "Evening atmosphere at Bukito, Kertasari" },
  { file: "BUKITO_IG15.webp", alt: "Village life near Bukito restaurant, Sumbawa" },
  { file: "BUKITO_IG24.webp", alt: "Sunset over the ocean near Lakey Peak" },
  { file: "bukito-barista.webp", alt: "Barista making coffee at Bukito cafe, Sumbawa" },
  { file: "bukito-exterior.webp", alt: "Bukito restaurant exterior, Kertasari Sumbawa Barat" },
  { file: "BUKITO_IG2.webp", alt: "Food and drinks at Bukito, best burger Sumbawa" },
];

/* Fetch photo list from Supabase storage API dynamically.
   When new photos are uploaded, they automatically appear. */
type Photo = { file: string; alt: string };

async function fetchPhotos(): Promise<Photo[]> {
  try {
    const res = await fetch(
      "https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/list/media",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prefix: "Bukito brand book/photos/",
          limit: 50,
          sortBy: { column: "created_at", order: "desc" },
        }),
      }
    );
    if (!res.ok) return FALLBACK_PHOTOS;
    const files = await res.json();
    const photos: Photo[] = files
      .filter((f: { name: string }) => /\.(webp|jpg|jpeg|png)$/i.test(f.name))
      .map((f: { name: string }) => ({
        file: f.name,
        alt: `Life at Bukito restaurant — ${f.name.replace(/\.(webp|jpg|png)$/i, "").replace(/[-_]/g, " ")}`,
      }));
    return photos.length > 0 ? photos : FALLBACK_PHOTOS;
  } catch {
    return FALLBACK_PHOTOS;
  }
}

/* Module-level cache — fetch once per browser session */
let photoCachePromise: Promise<Photo[]> | null = null;
function getPhotos() {
  if (!photoCachePromise) photoCachePromise = fetchPhotos();
  return photoCachePromise;
}

/* Varying heights for visual rhythm */
const HEIGHTS = [320, 400, 280, 360, 300, 380, 260, 340, 310, 370, 290];

function GalleryPhoto({
  photo,
  index,
}: {
  photo: Photo;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 100px" });
  const h = HEIGHTS[index % HEIGHTS.length];

  return (
    <motion.div
      ref={ref}
      className="flex-shrink-0"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.05, ease: EASE }}
    >
      <TiltPhoto maxTilt={4}>
        <div
          className="relative overflow-hidden hover-ken-burns"
          style={{ width: `${Math.round(h * 0.75)}px`, height: `${h}px` }}
        >
          <Image
            src={`${STORAGE_BASE}/${photo.file}`}
            alt={photo.alt}
            fill
            className="object-cover"
            sizes="300px"
          />
          <div className="noise absolute inset-0 pointer-events-none" />
        </div>
      </TiltPhoto>
    </motion.div>
  );
}

export function GalleryScene() {
  const [photos, setPhotos] = useState<Photo[]>(FALLBACK_PHOTOS);
  const [header, setHeader] = useState(FALLBACK_GALLERY_HEADER);

  useEffect(() => {
    getPhotos().then(setPhotos);
    fetchSiteSetting<GalleryHeader>("gallery").then((val) => {
      if (val) setHeader({ ...FALLBACK_GALLERY_HEADER, ...val });
    });
  }, []);

  return (
    <section className="relative bg-sand text-sunrust overflow-hidden py-24 sm:py-32 lg:py-40">
      {/* Header */}
      <FadeIn className="px-8 sm:px-16 lg:px-20 mb-10 sm:mb-14">
        <p className="text-[11px] tracking-[0.25em] opacity-20 mb-3">
          {header.label}
        </p>
        <h2 className="text-[clamp(2.5rem,7vw,5rem)] tracking-[-0.05em] leading-[0.85]">
          {header.heading}
        </h2>
      </FadeIn>

      {/* Side-scroller */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-sand to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-sand to-transparent z-10 pointer-events-none" />

        {/* Scrollable track */}
        <div
          className="flex gap-4 sm:gap-6 overflow-x-auto px-8 sm:px-16 lg:px-20 pb-4 scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* First spacer for left padding */}
          <div className="flex-shrink-0 w-0" />

          {photos.map((photo, i) => (
            <GalleryPhoto key={photo.file} photo={photo} index={i} />
          ))}

          {/* End spacer */}
          <div className="flex-shrink-0 w-8 sm:w-16" />
        </div>
      </div>
    </section>
  );
}
