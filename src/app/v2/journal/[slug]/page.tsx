"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabaseGet } from "@/lib/supabase-fetch";
import { resolveBrandPhoto, resolveBrandVideo } from "@/lib/brand-media";
import { FadeIn } from "@/app/components/FadeIn";

/* ─── Types ─── */

interface DbPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image_url: string;
  video_url: string;
  status: string;
  published_at: string | null;
  created_at: string;
}

/* ─── Helpers ─── */

function parseContent(raw: string): { text: string; gallery: string[] } {
  if (!raw) return { text: "", gallery: [] };
  try {
    const parsed = JSON.parse(raw) as { text?: string; gallery?: string[] };
    return { text: parsed.text ?? "", gallery: parsed.gallery ?? [] };
  } catch {
    return { text: raw, gallery: [] };
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

/** Render markdown-style headings and paragraphs */
function renderArticle(text: string) {
  const blocks = text.split("\n\n").filter((b) => b.trim());
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="text-xl sm:text-2xl tracking-[-0.03em] mt-10 mb-4"
        >
          {trimmed.slice(3)}
        </h2>
      );
    }
    return (
      <p key={i} className="mb-5 leading-relaxed text-sm sm:text-base">
        {trimmed}
      </p>
    );
  });
}

/* ─── Share Bar ─── */

function ShareBar({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState<string | null>(null);

  function getUrl() {
    return typeof window !== "undefined"
      ? window.location.href
      : `/v2/journal/${slug}`;
  }

  async function copyLink() {
    await navigator.clipboard.writeText(getUrl());
    setCopied("link");
    setTimeout(() => setCopied(null), 2000);
  }

  function shareWhatsApp() {
    const text = `${title}\n${getUrl()}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  }

  async function copyForInstagram() {
    const text = `${title}\n\n${getUrl()}`;
    await navigator.clipboard.writeText(text);
    setCopied("ig");
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-[11px] tracking-[0.2em] text-sunrust/40">
        SHARE
      </span>
      <button
        onClick={copyLink}
        className="text-xs text-sunrust/50 hover:text-sunrust transition-colors"
      >
        {copied === "link" ? "COPIED!" : "COPY LINK"}
      </button>
      <button
        onClick={shareWhatsApp}
        className="text-xs text-sunrust/50 hover:text-sunrust transition-colors"
      >
        WHATSAPP
      </button>
      <button
        onClick={copyForInstagram}
        className="text-xs text-sunrust/50 hover:text-sunrust transition-colors"
      >
        {copied === "ig" ? "CAPTION COPIED!" : "INSTAGRAM"}
      </button>
    </div>
  );
}

/* ─── Page ─── */

export default function JournalDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [post, setPost] = useState<DbPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabaseGet<DbPost[]>(
      `blog_posts?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=*&limit=1`,
    ).then((rows) => {
      setPost(rows && rows.length > 0 ? rows[0] : null);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black-magic flex items-center justify-center">
        <p className="text-sand/30 text-sm tracking-[0.2em]">LOADING...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black-magic flex flex-col items-center justify-center gap-6">
        <p className="text-sand/40 text-sm tracking-[0.2em]">
          POST NOT FOUND
        </p>
        <Link
          href="/v2"
          className="text-xs text-sand/30 hover:text-sand transition-colors tracking-[0.15em]"
        >
          BACK TO BUKITO
        </Link>
      </div>
    );
  }

  const { text, gallery } = parseContent(post.content);
  const coverUrl = resolveBrandPhoto(post.image_url);
  const videoUrl = resolveBrandVideo(post.video_url);
  const date = formatDate(post.published_at ?? post.created_at);

  return (
    <div className="min-h-screen bg-sand" data-lenis-prevent>
      {/* ── Cover Hero ── */}
      <section className="relative h-[60vh] sm:h-[70vh] bg-black-magic overflow-hidden">
        <Image
          src={coverUrl}
          alt={post.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black-magic via-black-magic/30 to-transparent" />
        <div className="noise absolute inset-0 pointer-events-none" />

        {/* Back link */}
        <Link
          href="/v2"
          className="absolute top-6 left-6 z-10 text-[11px] tracking-[0.2em] text-sand/40 hover:text-sand transition-colors"
        >
          &larr; BACK
        </Link>

        {/* Title overlay */}
        <div className="absolute bottom-8 left-6 right-6 sm:left-10 sm:right-10 z-10">
          <FadeIn y={20} duration={0.7}>
            <span className="text-[11px] tracking-[0.2em] text-sand/40 block mb-2">
              {post.category}
              {date && ` \u00b7 ${date}`}
              {post.author && ` \u00b7 ${post.author}`}
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl text-sand tracking-[-0.04em] leading-[0.9]">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-3 text-sm sm:text-base text-sand/50 max-w-xl">
                {post.excerpt}
              </p>
            )}
          </FadeIn>
        </div>
      </section>

      {/* ── Article Body ── */}
      <section className="bg-sand text-sunrust px-6 sm:px-10 py-12 sm:py-20">
        <div className="max-w-2xl mx-auto">
          <FadeIn y={30} duration={0.8}>
            <article className="prose-bukito">
              {text ? (
                renderArticle(text)
              ) : (
                <p className="text-sunrust/30 text-sm italic">
                  Content coming soon.
                </p>
              )}
            </article>
          </FadeIn>
        </div>
      </section>

      {/* ── Video ── */}
      {videoUrl && (
        <section className="bg-black-magic px-6 sm:px-10 py-12 sm:py-20">
          <div className="max-w-4xl mx-auto">
            <FadeIn y={20}>
              <video
                controls
                preload="metadata"
                poster={coverUrl}
                playsInline
                className="w-full rounded-sm"
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ── Gallery ── */}
      {gallery.length > 0 && (
        <section className="bg-sand px-6 sm:px-10 py-12 sm:py-16">
          <div className="max-w-5xl mx-auto">
            <FadeIn y={20}>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                {gallery.map((filename, i) => (
                  <div
                    key={`${filename}-${i}`}
                    className="relative flex-shrink-0 w-[280px] sm:w-[360px] h-[200px] sm:h-[260px] snap-start overflow-hidden rounded-sm"
                  >
                    <Image
                      src={resolveBrandPhoto(filename)}
                      alt={`${post.title} — photo ${i + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                      sizes="360px"
                    />
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ── Share Bar ── */}
      <section className="bg-sand border-t border-sunrust/10 px-6 sm:px-10 py-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <ShareBar title={post.title} slug={post.slug} />
          <Link
            href="/v2"
            className="text-xs text-sunrust/30 hover:text-sunrust transition-colors tracking-[0.15em]"
          >
            &larr; BACK TO BUKITO
          </Link>
        </div>
      </section>
    </div>
  );
}
