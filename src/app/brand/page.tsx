import Image from "next/image";
import { WorkspaceManager, ColorEditor, MediaUploader } from "./BrandEditor";

const STORAGE =
  "https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/public/media/Bukito%20brand%20book";

/* ─── Brand Data ─── */

const colors = {
  primary: [
    { name: "Sunrust", hex: "#6D0000", role: "Foreground / text" },
    { name: "Coconut Sand", hex: "#F8F5EA", role: "Background" },
    { name: "Black Magic", hex: "#000000", role: "Dark mode background" },
  ],
  secondary: [
    { name: "Jungle Green", hex: "#008134", role: "Prices, freshness, specials" },
    { name: "Orange Beach", hex: "#E67E32", role: "Events, social media warmth" },
    { name: "Wavy Blue", hex: "#A8C8E8", role: "Light accent, ocean vibes" },
  ],
};

const fonts = [
  { name: "Kisrre", file: "Kisrre.otf", role: "Primary — all headlines and body", sample: "PARADISE WITH FANGS" },
  { name: "Kisrre Rounded", file: "Kisrre-Rounded.otf", role: "Secondary — descriptions, captions", sample: "Belgian Roots, Local Soul" },
];

const logos = [
  { name: "Snake Bread", file: "logos/BUKITO_LogoSnakeBread.png" },
  { name: "Snake Coffee", file: "logos/BUKITO_LogoSnakeCoffee.png" },
  { name: "Snake Palm", file: "logos/BUKITO_LogoSnakePalm.png" },
];

const wordmarks = [
  "wordmarks/BUKITO_Wordmark.png",
  "wordmarks/BUKITO_WordmarkDistorted.png",
  "wordmarks/BUKITO_WordmarkFaded.png",
  "wordmarks/BUKITO_WordmarkAddress.png",
  "wordmarks/BUKITO_WordmarkSnakeBread.png",
  "wordmarks/BUKITO_WordmarkSnakePalm.png",
];

const iconNames = [
  "Banana", "Bat", "Cat1", "Cat2", "Chicken", "Coffee", "Cookies", "Crab",
  "Cutlery", "Dog", "Durian", "Egg", "Fish", "Gecko", "Glass", "Hand",
  "Leaf1", "Leaf2", "Milk", "Monkey", "Palmtree", "Pan", "Panther", "Papaya",
  "Pizza", "Ricebowl", "Scorpion", "Serpent", "Spider", "Stars", "Sunset",
  "Surf", "Tucan", "Turtle", "Volcano", "Volleybal", "Wave1", "Wave2",
];

const photos = [
  "BUKITO_IG1.webp", "BUKITO_IG3.webp", "BUKITO_IG7.webp", "BUKITO_IG11.webp",
  "BUKITO_IG15.webp", "BUKITO_IG19.webp", "BUKITO_IG22.webp", "BUKITO_IG24.webp",
  "bukito-barista.webp", "bukito-exterior.webp",
];

const typeSizes = [
  { label: "Display", size: "72px", sample: "BUKITO" },
  { label: "Headline", size: "48px", sample: "PARADISE WITH FANGS" },
  { label: "Title", size: "28px", sample: "WHERE THE JUNGLE MEETS THE SEA" },
  { label: "Body", size: "16px", sample: "BELGIAN ROOTS, LOCAL SOUL. WE COOK WHAT THE ISLAND GIVES US." },
  { label: "Label", size: "12px", sample: "KERTASARI, SUMBAWA BARAT — EST. 2024" },
];

/* ─── Components ─── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-20">
      <h2 className="text-2xl tracking-[-0.04em] text-sunrust mb-8 pb-3 border-b border-sunrust/10">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ColorSwatch({ name, hex, role }: { name: string; hex: string; role: string }) {
  const isLight = hex === "#F8F5EA" || hex === "#A8C8E8";
  return (
    <div className="flex items-center gap-4">
      <div
        className="w-16 h-16 rounded-sm shrink-0 border border-sunrust/10"
        style={{ backgroundColor: hex }}
      />
      <div>
        <p className="text-sm tracking-[-0.02em]">{name}</p>
        <p className="text-xs opacity-40 mt-0.5" style={{ fontFamily: "var(--font-kisrre-rounded)" }}>
          {hex} — {role}
        </p>
      </div>
    </div>
  );
}

/* ─── Page ─── */

export default function BrandDashboard() {
  return (
    <div className="min-h-screen bg-sand text-sunrust" data-page="brand">
      {/* Header */}
      <header className="px-8 sm:px-16 pt-16 pb-12 border-b border-sunrust/10">
        <p className="text-xs tracking-[0.2em] opacity-30 mb-3">Brand Dashboard</p>
        <h1 className="text-5xl sm:text-7xl tracking-[-0.05em] leading-[0.85]">
          Bukito
          <br />
          Brand Book
        </h1>
        <p
          className="text-xs opacity-30 mt-4 max-w-[50ch]"
          style={{ fontFamily: "var(--font-kisrre-rounded)" }}
        >
          Visual reference for all Bukito design and content work.
          Colors, typography, logos, icons, and photo library.
        </p>
      </header>

      <main className="px-8 sm:px-16 py-16 max-w-6xl">
        {/* Paper Workspaces */}
        <Section title="Paper Workspaces">
          <WorkspaceManager />
        </Section>

        {/* Colors — interactive */}
        <Section title="Color Palette">
          <div className="mb-8">
            <p className="text-xs tracking-[0.15em] opacity-30 mb-4">Primary</p>
            <ColorEditor group="primary" initial={colors.primary} />
          </div>
          <div>
            <p className="text-xs tracking-[0.15em] opacity-30 mb-4">Secondary</p>
            <ColorEditor group="secondary" initial={colors.secondary} />
          </div>
        </Section>

        {/* Typography */}
        <Section title="Typography">
          {/* Font files status */}
          <div className="mb-10">
            <p className="text-xs tracking-[0.15em] opacity-30 mb-4">Installed Fonts</p>
            <div className="flex flex-col gap-3">
              {fonts.map((f) => (
                <div key={f.name} className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-jungle shrink-0" title="Font loaded" />
                  <span className="text-sm">{f.name}</span>
                  <span className="text-xs opacity-25" style={{ fontFamily: "var(--font-kisrre-rounded)" }}>
                    ({f.file}) — {f.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Type scale */}
          <div className="flex flex-col gap-8">
            {typeSizes.map((t) => (
              <div key={t.label}>
                <p className="text-xs tracking-[0.15em] opacity-20 mb-2">
                  {t.label} — {t.size}
                </p>
                <p style={{ fontSize: t.size, lineHeight: 1, letterSpacing: "-0.04em" }}>
                  {t.sample}
                </p>
              </div>
            ))}
          </div>

          {/* Kisrre-Rounded sample */}
          <div className="mt-10 pt-8 border-t border-sunrust/8">
            <p className="text-xs tracking-[0.15em] opacity-20 mb-3">Kisrre Rounded — 14px</p>
            <p className="text-sm" style={{ fontFamily: "var(--font-kisrre-rounded)" }}>
              Bukito Is A Restaurant And Coffee Spot In Kertasari, Sumbawa Barat.
              Belgian Roots, Local Soul. We Cook What The Island Gives Us And Brew
              What Keeps The Surfers Coming Back.
            </p>
          </div>
        </Section>

        {/* Logos */}
        <Section title="Logos">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {logos.map((logo) => (
              <div key={logo.name} className="text-center">
                <div className="bg-sand border border-sunrust/8 p-6 flex items-center justify-center h-40">
                  <Image
                    src={`${STORAGE}/${logo.file}`}
                    alt={`Bukito ${logo.name} logo`}
                    width={120}
                    height={120}
                    className="object-contain max-h-28"
                  />
                </div>
                <p className="text-xs opacity-30 mt-2">{logo.name}</p>
              </div>
            ))}
          </div>

          {/* Dark mode logos */}
          <p className="text-xs tracking-[0.15em] opacity-20 mt-10 mb-4">On Dark Background</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {logos.map((logo) => (
              <div key={`dark-${logo.name}`} className="text-center">
                <div className="bg-black-magic border border-sand/8 p-6 flex items-center justify-center h-40">
                  <Image
                    src={`${STORAGE}/${logo.file}`}
                    alt={`Bukito ${logo.name} logo inverted`}
                    width={120}
                    height={120}
                    className="object-contain max-h-28 invert"
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Wordmarks */}
        <Section title="Wordmarks">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {wordmarks.map((wm) => (
              <div key={wm} className="bg-sand border border-sunrust/8 p-6 flex items-center justify-center h-24">
                <Image
                  src={`${STORAGE}/${wm}`}
                  alt={`Bukito wordmark variant`}
                  width={300}
                  height={60}
                  className="object-contain max-h-16"
                />
              </div>
            ))}
          </div>
        </Section>

        {/* Icons */}
        <Section title={`Icon Library (${iconNames.length} Icons)`}>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
            {iconNames.map((name) => (
              <div key={name} className="text-center group">
                <div className="bg-sand border border-sunrust/8 p-3 flex items-center justify-center h-20 group-hover:border-sunrust/20 transition-colors">
                  <Image
                    src={`${STORAGE}/icons/BUKITO_Icon_${name}.png`}
                    alt={`Bukito ${name} icon`}
                    width={48}
                    height={48}
                    unoptimized
                    className="object-contain max-h-12"
                  />
                </div>
                <p className="text-[11px] opacity-20 mt-1 truncate">{name}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Media Library */}
        <Section title="Media Library">
          <p className="text-xs opacity-25 mb-6" style={{ fontFamily: "var(--font-kisrre-rounded)" }}>
            Supabase Storage — {photos.length} photos. Drop photos or videos below to upload.
          </p>

          {/* Upload dropzone */}
          <div className="mb-8">
            <MediaUploader />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((photo) => (
              <div key={photo} className="relative aspect-square overflow-hidden hover-ken-burns">
                <Image
                  src={`${STORAGE}/photos/${photo}`}
                  alt={`Bukito photo ${photo.replace(".webp", "")}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
                <p className="absolute bottom-2 left-2 text-[11px] text-sand/60 bg-black-magic/50 px-2 py-0.5">
                  {photo}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Status */}
        <Section title="System Status">
          <div className="flex flex-col gap-3">
            <StatusRow label="Kisrre.otf" path="/fonts/Kisrre.otf" />
            <StatusRow label="Kisrre-Rounded.otf" path="/fonts/Kisrre-Rounded.otf" />
            <StatusRow label="Supabase Storage" path={`${STORAGE}/logos/BUKITO_LogoSnakeBread.png`} />
            <StatusRow label="Brand Skill" path=".claude/skills/bukito/SKILL.md" />
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="px-8 sm:px-16 py-8 border-t border-sunrust/8">
        <p className="text-xs opacity-15">
          Bukito Brand Dashboard — For Internal Use Only — Paradise With Fangs
        </p>
      </footer>
    </div>
  );
}

/* Status indicator — simple green dot for "exists" */
function StatusRow({ label, path }: { label: string; path: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-2.5 h-2.5 rounded-full bg-jungle/60 shrink-0" />
      <span className="text-sm">{label}</span>
      <span className="text-xs opacity-20 truncate" style={{ fontFamily: "var(--font-kisrre-rounded)" }}>
        {path}
      </span>
    </div>
  );
}
