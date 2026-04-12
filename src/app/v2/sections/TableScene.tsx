"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TiltPhoto } from "../components/TiltPhoto";
import { supabaseGet } from "../../../lib/supabase-fetch";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

type MenuItem = {
  name: string;
  desc?: string;
  price: string;
};

type MenuCategory = {
  title: string;
  color: string;
  photo: string;
  items: MenuItem[];
  note?: string;
};

/** DB row shapes from Supabase */
type DbMenuItem = {
  name: string;
  description: string | null;
  price: number;
  sort_order: number;
};

type DbCategory = {
  id: string;
  title: string;
  sort_order: number;
  note: string | null;
  menu_items: DbMenuItem[];
};

/** Map category title to a display color and photo */
const CATEGORY_META: Record<string, { color: string; photo: string }> = {
  Kitchen: { color: "#6D0000", photo: "/photos/BUKITO_IG1.webp" },
  Bites: { color: "#6D0000", photo: "/photos/BUKITO_IG12.webp" },
  Sweets: { color: "#E67E32", photo: "/photos/BUKITO_IG11.webp" },
  Coffee: { color: "#008134", photo: "/photos/bukito-barista.webp" },
  "Herbal & Tea": { color: "#008134", photo: "/photos/BUKITO_IG19.webp" },
  Drinks: { color: "#A8C8E8", photo: "/photos/BUKITO_IG22.webp" },
};

const DEFAULT_META = { color: "#6D0000", photo: "/photos/BUKITO_IG1.webp" };

/** Format price number to display string (e.g. 70000 -> "70k") */
function formatPrice(price: number): string {
  if (price >= 1000) return `${Math.round(price / 1000)}k`;
  return String(price);
}

/** Transform DB categories to component shape */
function transformCategories(dbCats: DbCategory[]): MenuCategory[] {
  return dbCats.map((cat) => {
    const meta = CATEGORY_META[cat.title] ?? DEFAULT_META;
    return {
      title: cat.title,
      color: meta.color,
      photo: meta.photo,
      items: cat.menu_items
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((item) => ({
          name: item.name,
          desc: item.description ?? undefined,
          price: formatPrice(item.price),
        })),
      note: cat.note ?? undefined,
    };
  });
}

const FALLBACK_CATEGORIES: MenuCategory[] = [
  {
    title: "Kitchen",
    color: "#6D0000",
    photo: "/photos/BUKITO_IG1.webp",
    items: [
      {
        name: "Breakfast Bun",
        desc: "Potato bun, fried egg, cheddar, avocado, tomato salsa",
        price: "70k",
      },
      {
        name: "Bubur Ketan Hitam",
        desc: "Black rice porridge, coconut milk, pandan, Sumbawa honey",
        price: "55k",
      },
      {
        name: "Crispy Chili Eggs",
        desc: "Chilli oil, crispy peanuts, feta, avocado, sourdough",
        price: "70k",
      },
      {
        name: "Tuna Melt",
        desc: "Sourdough, tuna salad, cheddar, tomato, sambal mayo",
        price: "75k",
      },
      {
        name: "Smash Burger",
        desc: "Double beef, cheddar, caramelised onion, Bukito sauce",
        price: "95k",
      },
      {
        name: "Katsu Chicken",
        desc: "Panko katsu, Japanese curry, steamed rice",
        price: "90k",
      },
      {
        name: "Big Salad",
        desc: "Grilled veg, honey halloumi, chickpeas, yoghurt, flatbread",
        price: "75k",
      },
      {
        name: "French Toast",
        desc: "Cardamom custard, palm sugar brulee, yuzu cream",
        price: "60k",
      },
    ],
  },
  {
    title: "Bites",
    color: "#6D0000",
    photo: "/photos/BUKITO_IG12.webp",
    items: [
      {
        name: "Baba Ganoush",
        desc: "Smoked eggplant, olive oil, flatbread",
        price: "55k",
      },
      {
        name: "Gochu Chicken",
        desc: "Gochujang glaze, sesame, lime",
        price: "65k",
      },
      {
        name: "Crispy Shrimp",
        desc: "Panko, Chef Ragil's hot sauce",
        price: "55k",
      },
      { name: "Fried Tofu", desc: "Honey ginger sauce", price: "35k" },
    ],
  },
  {
    title: "Sweets",
    color: "#E67E32",
    photo: "/photos/BUKITO_IG11.webp",
    items: [
      { name: "Sorbet", desc: "Local fruit, sugar-free", price: "30k" },
      {
        name: "Affogato",
        desc: "Vanilla, espresso, sea salt, cookie",
        price: "40k",
      },
      {
        name: "Fondant",
        desc: "Molten chocolate, vanilla ice cream",
        price: "45k",
      },
    ],
  },
  {
    title: "Coffee",
    color: "#008134",
    photo: "/photos/bukito-barista.webp",
    items: [
      { name: "Espresso", price: "30k" },
      { name: "Americano", price: "35k" },
      { name: "Cappuccino / Latte / Flat White", price: "40k" },
      { name: "Matcha Latte", price: "40k" },
    ],
    note: "Ice +5k / Oat Milk +10k",
  },
  {
    title: "Herbal & Tea",
    color: "#008134",
    photo: "/photos/BUKITO_IG19.webp",
    items: [
      { name: "Turmeric Brew", price: "30k" },
      { name: "Spiced Tea", price: "30k" },
      { name: "Herbal / Green / Black Tea", price: "20k" },
    ],
  },
  {
    title: "Drinks",
    color: "#A8C8E8",
    photo: "/photos/BUKITO_IG22.webp",
    items: [
      { name: "Ginger Lemon Cooler", price: "35k" },
      { name: "Tamarind Cooler", price: "35k" },
      { name: "Fresh Juice", price: "30k" },
      { name: "Bintang", price: "45k" },
      { name: "Draft Beer", price: "45k" },
    ],
  },
];

const CDN =
  "https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/public/media/Bukito%20brand%20book";

export function TableScene() {
  const [categories, setCategories] = useState<MenuCategory[]>(FALLBACK_CATEGORIES);
  const [hovered, setHovered] = useState<string | null>(null);
  const [openCat, setOpenCat] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const hoveredCat = categories.find((c) => c.title === hovered);

  useEffect(() => {
    supabaseGet<DbCategory[]>(
      "menu_categories?select=*,menu_items(*)&order=sort_order",
    ).then((data) => {
      if (data && data.length > 0) {
        setCategories(transformCategories(data));
      }
    });
  }, []);

  return (
    <section className="relative overflow-hidden bg-sand text-sunrust">
      {/* Background photo flash — full viewport, low opacity */}
      <AnimatePresence mode="wait">
        {hoveredCat && (
          <motion.div
            key={hoveredCat.title}
            className="pointer-events-none absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: EASE,
            }}
          >
            <Image
              src={hoveredCat.photo}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 px-8 py-24 sm:px-16 sm:py-32 lg:flex lg:gap-20 lg:px-20 lg:py-40">
        {/* Left: menu categories */}
        <div className="flex-1 max-w-3xl">
          {/* Header */}
          <p className="text-[11px] tracking-[0.25em] opacity-20 mb-3">
            All Produced From Scratch In House
          </p>
          {/* Menu fold-out — distinct surface so it reads as its own tap target */}
          <div className="mb-8 rounded-2xl border border-sunrust/12 bg-wavy-blue/20 px-4 py-3 sm:px-5 sm:py-4 shadow-[inset_0_1px_0_rgba(248,245,234,0.35)]">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="group flex w-full items-center gap-3 sm:gap-4 cursor-pointer active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunrust/35 focus-visible:ring-offset-2 focus-visible:ring-offset-wavy-blue/25 rounded-xl"
              aria-expanded={menuOpen}
              aria-controls="menu-foldout"
            >
              <h2 className="text-left text-[clamp(2.5rem,7vw,5rem)] leading-[0.85] tracking-[-0.05em]">
                The Menu
              </h2>
              <motion.svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="mt-1 shrink-0 opacity-35 group-hover:opacity-55 transition-opacity"
                animate={{ rotate: menuOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </motion.svg>
              <span
                className="ml-auto flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-sunrust/10 bg-sand/95 shadow-sm sm:h-14 sm:w-14"
                aria-hidden="true"
              >
                <Image
                  src={`${CDN}/icons/BUKITO_Icon_Monkey.png`}
                  alt=""
                  width={88}
                  height={88}
                  className="h-11 w-11 object-contain sm:h-12 sm:w-12"
                  unoptimized
                />
              </span>
            </button>
          </div>

          {/* Foldout content */}
          <AnimatePresence initial={false}>
            {menuOpen && (
              <motion.div
                id="menu-foldout"
                role="region"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="overflow-hidden"
              >
                <p
                  className="text-[11px] tracking-[0.1em] opacity-15 mb-8"
                  style={{ fontFamily: "var(--font-kisrre-rounded)" }}
                >
                  All Prices In Thousand Idr (Rp)
                </p>

                {/* Category rows */}
                <div>
                  {categories.map((cat) => (
                    <div key={cat.title} className="border-t border-sunrust/8">
                      <button
                        className="group flex w-full items-center justify-between py-5 text-left sm:py-7 cursor-pointer active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunrust/30 focus-visible:ring-offset-2 focus-visible:ring-offset-sand"
                        onClick={() =>
                          setOpenCat(openCat === cat.title ? null : cat.title)
                        }
                        onMouseEnter={() => setHovered(cat.title)}
                        onMouseLeave={() => setHovered(null)}
                        aria-expanded={openCat === cat.title}
                        aria-controls={`menu-${cat.title.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <motion.span
                          className="text-3xl sm:text-4xl lg:text-5xl tracking-[-0.04em] transition-opacity duration-200"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2, ease: EASE }}
                        >
                          {cat.title}
                        </motion.span>

                        <span className="flex items-center gap-3">
                          <span className="text-[11px] tracking-[0.15em] opacity-15">
                            {cat.items.length}
                          </span>
                          <motion.svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="opacity-20"
                            animate={{ rotate: openCat === cat.title ? 45 : 0 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            aria-hidden="true"
                          >
                            <path d="M12 5v14M5 12h14" />
                          </motion.svg>
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {openCat === cat.title && (
                          <motion.div
                            id={`menu-${cat.title.toLowerCase().replace(/\s+/g, "-")}`}
                            role="region"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="pb-8 lg:grid lg:grid-cols-2 lg:gap-x-12">
                              {cat.items.map((item, i) => (
                                <motion.div
                                  key={item.name}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    duration: 0.2,
                                    delay: i * 0.04,
                                    ease: EASE,
                                  }}
                                  className="flex items-baseline justify-between gap-3 border-b border-sunrust/5 py-2.5 last:border-b-0"
                                >
                                  <div className="min-w-0 flex-1">
                                    <span className="text-xs tracking-[-0.03em] sm:text-sm">
                                      {item.name}
                                    </span>
                                    {"desc" in item && item.desc && (
                                      <p
                                        className="mt-0.5 text-[11px] leading-relaxed opacity-20"
                                        style={{
                                          fontFamily:
                                            "var(--font-kisrre-rounded)",
                                        }}
                                      >
                                        {item.desc}
                                      </p>
                                    )}
                                  </div>
                                  <span className="shrink-0 text-xs tracking-[-0.03em] text-jungle sm:text-sm">
                                    {item.price}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                            {cat.note && (
                              <p className="pb-6 -mt-4 text-[11px] tracking-[0.1em] opacity-15">
                                {cat.note}
                              </p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                  <div className="border-t border-sunrust/8" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* WhatsApp CTA — always visible */}
          <a
            href="https://wa.me/6282234606010"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-3 text-xs tracking-[0.15em] opacity-40 transition-opacity hover:opacity-70 active:scale-[0.97] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunrust/30 focus-visible:ring-offset-2 focus-visible:ring-offset-sand"
          >
            Hungry? Message Us On WhatsApp
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="opacity-40"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>

        {/* Right: Chef portrait + cat photo (desktop only) */}
        <div className="hidden lg:block lg:w-[180px] lg:shrink-0 lg:pt-32">
          <div className="sticky top-40">
            <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full">
              <Image
                src="/photos/chef-ragil.webp"
                alt="Chef Ragil"
                fill
                className="object-cover object-top"
              />
            </div>
            <p className="mt-4 text-center text-[11px] tracking-[0.1em] opacity-30">
              Chef Ragil
            </p>
            <p className="mt-1 text-center text-[11px] tracking-[0.15em] opacity-15">
              Head Chef
            </p>

            {/* 3D tilt cat photo */}
            <TiltPhoto className="mt-12">
              <div className="relative h-[140px] w-[140px] mx-auto overflow-hidden rotate-2">
                <Image
                  src="/photos/BUKITO_IG3.webp"
                  alt="Cat at Bukito"
                  fill
                  className="object-cover"
                />
              </div>
            </TiltPhoto>
          </div>
        </div>
      </div>
    </section>
  );
}
