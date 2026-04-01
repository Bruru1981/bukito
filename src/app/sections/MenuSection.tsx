"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FadeIn } from "../components/FadeIn";

/* ─── Menu data ─── */
const categories = [
  {
    title: "Kitchen",
    items: [
      { name: "Breakfast Bun", desc: "Potato bun, fried egg, cheddar, avocado, tomato salsa", price: "70k" },
      { name: "Bubur Ketan Hitam", desc: "Black rice porridge, coconut milk, pandan, Sumbawa honey", price: "55k" },
      { name: "Crispy Chili Eggs", desc: "Chilli oil, crispy peanuts, feta, avocado, sourdough", price: "70k" },
      { name: "Bubur Ayam", desc: "Rice porridge, shredded chicken, soft-boiled egg, krupuk", price: "70k" },
      { name: "Tuna Melt", desc: "Sourdough, tuna salad, cheddar, tomato, sambal mayo", price: "75k" },
      { name: "Chicken Sandwich", desc: "Baguette, pulled Taliwang BBQ chicken, coleslaw", price: "75k" },
      { name: "Smash Burger", desc: "Double beef, cheddar, caramelised onion, Bukito sauce", price: "95k" },
      { name: "Katsu Chicken", desc: "Panko katsu, Japanese curry, steamed rice", price: "90k" },
      { name: "Big Salad", desc: "Grilled veg, honey halloumi, chickpeas, yoghurt, flatbread", price: "75k" },
      { name: "Grilled Cheese", desc: "Sourdough, three-cheese blend, kimchi mayo", price: "70k" },
      { name: "French Toast", desc: "Cardamom custard, palm sugar brul\u00e9e, yuzu cream", price: "60k" },
      { name: "Fruit Plate", desc: "Fresh local fruit selection", price: "50k" },
    ],
  },
  {
    title: "Bites",
    items: [
      { name: "Baba Ganoush", desc: "Smoked eggplant, olive oil, flatbread", price: "55k" },
      { name: "Gochu Chicken", desc: "Gochujang glaze, sesame, lime", price: "65k" },
      { name: "Crispy Shrimp", desc: "Panko, Chef Ragil's hot sauce", price: "55k" },
      { name: "Fried Tofu", desc: "Honey ginger sauce", price: "35k" },
    ],
  },
  {
    title: "Sweets",
    items: [
      { name: "Sorbet", desc: "Local fruit, sugar-free", price: "30k" },
      { name: "Affogato", desc: "Vanilla, espresso, sea salt, cookie", price: "40k" },
      { name: "Cheesecake", price: "40k" },
      { name: "Bread Pudding", desc: "Caramel, vanilla cream", price: "45k" },
      { name: "Fondant", desc: "Molten chocolate, vanilla ice cream", price: "45k" },
    ],
  },
  {
    title: "Coffee",
    items: [
      { name: "Espresso", price: "30k" },
      { name: "Americano", price: "35k" },
      { name: "Cappuccino / Latte / Flat White", price: "40k" },
      { name: "Matcha Latte", price: "40k" },
      { name: "Yuzu Matcha", price: "45k" },
    ],
    note: "Ice +5k / Oat Milk +10k",
  },
  {
    title: "Herbal & Tea",
    items: [
      { name: "Turmeric Brew", price: "30k" },
      { name: "Spiced Tea", price: "30k" },
      { name: "Herbal / Green / Black Tea", price: "20k" },
      { name: "English Breakfast", price: "20k" },
    ],
  },
  {
    title: "Drinks",
    items: [
      { name: "Ginger Lemon Cooler", price: "35k" },
      { name: "Tamarind Cooler", price: "35k" },
      { name: "Cucumber Cooler", price: "35k" },
      { name: "Fresh Juice", price: "30k" },
      { name: "Bintang", price: "45k" },
      { name: "Draft Beer", price: "45k" },
    ],
  },
];

/* ─── Components ─── */

function Item({ name, desc, price }: { name: string; desc?: string; price: string }) {
  return (
    <div className="flex justify-between items-baseline gap-3 py-2.5 border-b border-sunrust/6 last:border-b-0">
      <div className="flex-1 min-w-0">
        <span className="text-xs sm:text-sm tracking-[-0.03em]">{name}</span>
        {desc && (
          <p
            className="text-[11px] sm:text-xs tracking-[-0.01em] opacity-25 mt-0.5 leading-relaxed"
            style={{ fontFamily: "var(--font-kisrre-rounded)" }}
          >
            {desc}
          </p>
        )}
      </div>
      <span className="text-xs sm:text-sm tracking-[-0.03em] text-jungle shrink-0">{price}</span>
    </div>
  );
}

function Accordion({ title, items, note }: {
  title: string;
  items: { name: string; desc?: string; price: string }[];
  note?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-sunrust/10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex justify-between items-center py-5 sm:py-6 text-left group cursor-pointer"
        aria-expanded={open}
      >
        <h3 className="text-lg sm:text-xl lg:text-2xl tracking-[-0.04em] group-hover:text-black-magic transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-xs tracking-[0.1em] opacity-20">
            {items.length} Items
          </span>
          <motion.svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="opacity-30"
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </motion.svg>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 sm:pb-8 lg:grid lg:grid-cols-2 lg:gap-x-12">
              {items.map((item) => (
                <Item key={item.name} {...item} />
              ))}
            </div>
            {note && (
              <p className="text-[11px] tracking-[0.1em] opacity-20 pb-6 -mt-3">
                {note}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Section ─── */

export function MenuSection() {
  return (
    <section className="relative bg-sand text-sunrust overflow-hidden py-24 sm:py-32 lg:py-40">
      <div className="px-8 sm:px-16 lg:px-20 max-w-5xl">
        {/* Header row — title + chef photo */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-16 mb-12 sm:mb-16">
          <div>
            <FadeIn>
              <p className="text-[11px] sm:text-lg tracking-[0.25em] opacity-80 mb-4">
                All Produced From Scratch In House
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="text-5xl sm:text-7xl lg:text-8xl tracking-[-0.05em] leading-[0.85]">
                The
                <br />
                Menu
              </h2>
            </FadeIn>
          </div>

          {/* Chef Ragil — small portrait next to title */}
          <FadeIn delay={0.2} className="shrink-0">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 overflow-hidden rounded-full">
                <Image
                  src="/photos/chef-ragil.webp"
                  alt="Chef Ragil"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div>
                <p className="text-xs tracking-[-0.02em]">Chef Ragil</p>
                <p className="text-[11px] tracking-[0.1em] opacity-25 mt-0.5">Head Chef</p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Accordion foldouts */}
        <FadeIn delay={0.15}>
          <div>
            {categories.map((cat) => (
              <Accordion key={cat.title} {...cat} />
            ))}
          </div>
          {/* Last border */}
          <div className="border-t border-sunrust/10" />
        </FadeIn>

        {/* WhatsApp for delivery */}
        <FadeIn delay={0.2} className="mt-10 sm:mt-14">
          <a
            href="https://wa.me/6282234606010"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-lg tracking-[0.15em] opacity-70 hover:opacity-60 transition-opacity"
          >
            Take-Out + Delivery &bull; WA +6282234606010
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
