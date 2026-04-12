"use client";

import Image from "next/image";

const STORAGE =
  "https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/public/media/Bukito%20brand%20book";

const icons = [
  "Surf",
  "Coffee",
  "Palmtree",
  "Fish",
  "Sunset",
  "Volcano",
  "Turtle",
  "Crab",
  "Gecko",
  "Tucan",
  "Monkey",
  "Bat",
];

export function IconMarquee() {
  /* Duplicate the icon list so the animation loops seamlessly */
  const doubled = [...icons, ...icons];

  return (
    <div className="relative overflow-hidden py-16">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-sand to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-sand to-transparent z-10" />

      <div className="animate-marquee flex items-center gap-16 sm:gap-24 w-max">
        {doubled.map((name, i) => (
          <div
            key={`${name}-${i}`}
            className="flex-shrink-0 transition-opacity duration-300 opacity-20 hover:opacity-60"
          >
            <Image
              src={`${STORAGE}/icons/BUKITO_Icon_${name}.png`}
              alt={name}
              width={56}
              height={56}
              className="w-12 h-12 sm:w-14 sm:h-14"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
