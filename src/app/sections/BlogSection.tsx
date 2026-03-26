"use client";

import Image from "next/image";
import { FadeIn } from "../components/FadeIn";

/* Placeholder posts — will be Supabase-backed later */
const posts = [
  {
    slug: "kl-food-crawl",
    title: "KL Food Crawl",
    excerpt: "Three Days Eating Through Kuala Lumpur's Best Hawker Stalls And Hidden Restaurants",
    category: "On The Road",
    date: "Mar 2026",
    image: "/photos/BUKITO_IG12.webp",
    alt: "Street food scene in Kuala Lumpur food market",
  },
  {
    slug: "sourdough-sumbawa",
    title: "Making Sourdough On A Tropical Island",
    excerpt: "Why Humidity Is Both The Enemy And The Secret Ingredient",
    category: "Kitchen Notes",
    date: "Feb 2026",
    image: "/photos/BUKITO_IG1.webp",
    alt: "Fresh sourdough bread baking at Bukito kitchen Sumbawa",
  },
  {
    slug: "lakey-peak-guide",
    title: "A Surfer's Guide To Lakey Peak",
    excerpt: "The Waves, The Lineup, And Where To Eat After",
    category: "Sumbawa Life",
    date: "Jan 2026",
    image: "/photos/BUKITO_IG24.webp",
    alt: "Sunset at Lakey Peak beach near Bukito restaurant Sumbawa",
  },
];

function PostCard({
  title,
  excerpt,
  category,
  date,
  image,
  alt,
  featured = false,
}: {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  alt: string;
  featured?: boolean;
}) {
  return (
    <article
      className={`group cursor-pointer ${featured ? "lg:col-span-2 lg:row-span-2" : ""}`}
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden hover-ken-burns mb-4 sm:mb-5 ${
          featured ? "h-[300px] sm:h-[400px] lg:h-[500px]" : "h-[200px] sm:h-[260px]"
        }`}
      >
        <Image
          src={image}
          alt={alt}
          fill
          sizes={featured ? "(max-width: 1024px) 100vw, 66vw" : "33vw"}
          className="object-cover"
        />
        {/* Grain overlay */}
        <div className="absolute inset-0 noise pointer-events-none" />
        <div className="absolute inset-0 bg-sunrust/[0.03]" />
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-[11px] tracking-[0.2em] text-sand/40">
          {category}
        </span>
        <span className="text-[11px] opacity-15">/</span>
        <span className="text-[11px] tracking-[0.15em] opacity-20">
          {date}
        </span>
      </div>

      {/* Title */}
      <h3
        className={`tracking-[-0.04em] leading-[0.95] group-hover:text-sand transition-colors ${
          featured ? "text-2xl sm:text-3xl lg:text-4xl" : "text-lg sm:text-xl"
        }`}
      >
        {title}
      </h3>

      {/* Excerpt */}
      <p
        className="text-xs tracking-[-0.01em] leading-relaxed opacity-30 mt-2 max-w-[40ch]"
        style={{ fontFamily: "var(--font-kisrre-rounded)" }}
      >
        {excerpt}
      </p>
    </article>
  );
}

export function BlogSection() {
  return (
    <section className="relative bg-black-magic text-sand overflow-hidden py-24 sm:py-32 lg:py-40 px-8 sm:px-16 lg:px-20">
      <div className="noise absolute inset-0 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14 sm:mb-20">
          <div>
            <FadeIn>
              <p className="text-xs tracking-[0.25em] text-sand/25 mb-4">
                Stories From The Road And The Kitchen
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="text-5xl sm:text-7xl lg:text-8xl tracking-[-0.05em] leading-[0.85]">
                Journal
              </h2>
            </FadeIn>
          </div>

          <FadeIn delay={0.2}>
            <a
              href="/journal"
              className="group flex items-center gap-2 text-xs tracking-[0.15em] text-sand/35 hover:text-sand transition-colors"
            >
              View All
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

        {/* Posts grid — featured first post, two smaller */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {posts.map((post, i) => (
            <FadeIn key={post.slug} delay={i * 0.1}>
              <PostCard {...post} featured={i === 0} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
