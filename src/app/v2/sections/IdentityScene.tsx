"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FadeIn } from "../../components/FadeIn";
import { fetchSiteSetting } from "../../../lib/supabase-fetch";
import { resolveBrandPhoto } from "../../../lib/brand-media";

type IdentityData = {
  established: string;
  blurb: string;
  image: string;
  imageAlt: string;
};

const FALLBACK: IdentityData = {
  established: "Est. 2024 \u00b7 Kertasari",
  blurb: "Belgian Kitchen Meets Local Soul. Surf Town Restaurant At The End Of The Road. From Breakfast Buns To Smash Burgers, Espresso To Evening Cocktails. Where The Surf Crowd Meets The Village.",
  image: "photos/bukito-exterior.webp",
  imageAlt: "Bukito restaurant and coffee bar building in Kertasari, Sumbawa Barat",
};

export function IdentityScene() {
  const [data, setData] = useState<IdentityData>(FALLBACK);

  useEffect(() => {
    fetchSiteSetting<IdentityData>("identity").then((val) => {
      if (val) setData({ ...FALLBACK, ...val });
    });
  }, []);

  return (
    <section className="relative bg-sand text-sunrust px-8 py-20 sm:px-16 sm:py-28 lg:px-20">
      <div className="max-w-2xl">
        <FadeIn>
          <p className="text-[11px] tracking-[0.25em] opacity-20 mb-4">
            {data.established}
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="text-lg sm:text-xl lg:text-2xl tracking-[-0.03em] leading-[1.2] opacity-70">
            {data.blurb}
          </p>
        </FadeIn>

        <FadeIn delay={0.15} className="mt-10">
          <figure className="relative w-full max-w-xl aspect-[4/3] overflow-hidden rounded-sm border border-sunrust/10">
            <Image
              src={resolveBrandPhoto(data.image)}
              alt={data.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 42rem"
            />
          </figure>
        </FadeIn>

        <FadeIn delay={0.2} className="mt-6">
          <div className="editorial-divider" />
        </FadeIn>
      </div>
    </section>
  );
}
