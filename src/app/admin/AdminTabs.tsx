"use client";

import { useState, useEffect, useCallback } from "react";

/* ─── Constants ─── */

const STORAGE_URL =
  "https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/public/media/";
const PHOTOS_PREFIX = "Bukito brand book/photos/";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsbWd3YXl3cHRxbHp1ZG9pd290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjU3OTIsImV4cCI6MjA4OTkwMTc5Mn0.F2kYymu9_t9THk2VI_g4cgpYv70oa9CVIcsCKSb0LL8";

/* ─── Types ─── */

interface DayHours {
  day: string;
  opens: string;
  closes: string;
  closed: boolean;
}

interface HoursData {
  days: DayHours[];
}

interface SiteSettings {
  contact?: {
    address?: string;
    city?: string;
    whatsapp?: string;
    email?: string;
  };
  hours?: HoursData;
  social?: { instagram?: string; tiktok?: string };
  about_blurb?: { text?: string; image?: string };
}

interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: string;
  sort_order: number;
  is_active: boolean;
}

interface MenuCategory {
  id: string;
  title: string;
  sort_order: number;
  note: string | null;
  items: MenuItem[];
}

interface JournalPost {
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
  updated_at: string;
}

interface Playlist {
  id: string;
  title: string;
  description: string;
  track_count: number;
  duration: string;
  spotify_url: string;
  color: string;
  sort_order: number;
}

interface TabProps {
  password: string;
  showToast: (msg: string) => void;
}

/* ─── Helpers ─── */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function photoUrl(filename: string): string {
  return (
    STORAGE_URL +
    (PHOTOS_PREFIX + filename)
      .split("/")
      .map((seg) => encodeURIComponent(seg))
      .join("/")
  );
}

function parseGallery(content: string): string[] {
  if (!content) return [];
  try {
    const parsed = JSON.parse(content) as { gallery?: string[] };
    return parsed.gallery ?? [];
  } catch {
    return [];
  }
}

function serializeGallery(gallery: string[], existingContent: string): string {
  let parsed: Record<string, unknown> = {};
  if (existingContent) {
    try {
      parsed = JSON.parse(existingContent) as Record<string, unknown>;
    } catch {
      if (existingContent.trim()) parsed = { text: existingContent };
    }
  }
  parsed.gallery = gallery;
  return JSON.stringify(parsed);
}

const DEFAULT_DAYS: DayHours[] = [
  { day: "Monday", opens: "08:00", closes: "22:00", closed: false },
  { day: "Tuesday", opens: "08:00", closes: "22:00", closed: false },
  { day: "Wednesday", opens: "08:00", closes: "22:00", closed: false },
  { day: "Thursday", opens: "08:00", closes: "22:00", closed: false },
  { day: "Friday", opens: "08:00", closes: "22:00", closed: false },
  { day: "Saturday", opens: "08:00", closes: "22:00", closed: false },
  { day: "Sunday", opens: "08:00", closes: "22:00", closed: false },
];

const SEED_POSTS: Omit<
  JournalPost,
  "id" | "published_at" | "created_at" | "updated_at"
>[] = [
  {
    slug: "kl-food-crawl",
    title: "KL Food Crawl",
    excerpt:
      "Three Days Eating Through Kuala Lumpur's Best Hawker Stalls",
    category: "On The Road",
    author: "",
    image_url: "BUKITO_IG12.webp",
    video_url: "",
    content: "",
    status: "published",
  },
  {
    slug: "sourdough-sumbawa",
    title: "Making Sourdough On A Tropical Island",
    excerpt: "Why Humidity Is Both The Enemy And The Secret",
    category: "Kitchen Notes",
    author: "",
    image_url: "BUKITO_IG1.webp",
    video_url: "",
    content: "",
    status: "published",
  },
  {
    slug: "lakey-peak-guide",
    title: "A Surfer's Guide To Lakey Peak",
    excerpt: "The Waves, The Lineup, And Where To Eat After",
    category: "Sumbawa Life",
    author: "",
    image_url: "BUKITO_IG24.webp",
    video_url: "",
    content: "",
    status: "published",
  },
];

/* ─── API wrapper ─── */

async function api<T>(
  path: string,
  options?: RequestInit & { password?: string },
): Promise<{ data?: T; error?: string }> {
  const { password, ...fetchOptions } = options ?? {};
  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };
  if (password) headers["Authorization"] = `Bearer ${password}`;
  if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  try {
    const res = await fetch(`/api/admin/${path}`, {
      ...fetchOptions,
      headers,
    });
    const json = await res.json();
    if (!res.ok)
      return {
        error:
          (json as { error?: string }).error ?? `HTTP ${res.status}`,
      };
    return { data: json as T };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

async function fetchStoragePhotos(): Promise<string[]> {
  const res = await fetch(
    "https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/list/media",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        prefix: "Bukito brand book/photos/",
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      }),
    },
  );
  if (!res.ok) return [];
  const files = (await res.json()) as { name: string }[];
  return files
    .filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f.name))
    .map((f) => f.name);
}

async function fetchStorageVideos(): Promise<string[]> {
  const res = await fetch(
    "https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/list/media",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        prefix: "Bukito brand book/videos/",
        limit: 50,
        sortBy: { column: "created_at", order: "desc" },
      }),
    },
  );
  if (!res.ok) return [];
  const files = (await res.json()) as { name: string }[];
  return files
    .filter((f) => /\.(mp4|mov|webm)$/i.test(f.name))
    .map((f) => f.name);
}

/* ─── Shared styles ─── */

const inputClass =
  "w-full px-3 py-2 border border-sunrust/20 bg-sand text-sunrust placeholder-sunrust/30 rounded focus:outline-none focus:border-sunrust text-sm";
const btnPrimary =
  "bg-sunrust text-sand px-4 py-2 rounded text-sm hover:bg-sunrust/90 transition-colors";
const btnDanger =
  "bg-red-700 text-sand px-4 py-2 rounded text-sm hover:bg-red-800 transition-colors";
const btnSecondary =
  "border border-sunrust/30 text-sunrust px-4 py-2 rounded text-sm hover:bg-sunrust/5 transition-colors";
const labelClass = "block text-xs text-sunrust/60 mb-1";

/* ═══════════════════════════════════════════════════
   IMAGE PICKER
   ═══════════════════════════════════════════════════ */

function ImagePicker({
  photos,
  selected,
  onSelect,
  label,
}: {
  photos: string[];
  selected: string;
  onSelect: (filename: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <label className={labelClass}>{label}</label>
      {selected && (
        <div className="mb-2 relative inline-block">
          <img
            src={photoUrl(selected)}
            alt={selected}
            className="w-32 h-24 object-cover rounded border border-sunrust/20"
          />
          <button
            type="button"
            className="absolute -top-1 -right-1 bg-red-700 text-sand w-5 h-5 rounded-full text-xs flex items-center justify-center"
            onClick={() => onSelect("")}
          >
            x
          </button>
        </div>
      )}
      <button
        type="button"
        className={btnSecondary}
        onClick={() => setOpen(!open)}
      >
        {selected ? "CHANGE IMAGE" : "SELECT IMAGE"}
      </button>
      {open && (
        <div className="mt-2 grid grid-cols-4 md:grid-cols-6 gap-2 max-h-64 overflow-y-auto border border-sunrust/10 rounded p-2">
          {photos.map((photo) => (
            <button
              key={photo}
              type="button"
              onClick={() => {
                onSelect(photo);
                setOpen(false);
              }}
              className={`rounded overflow-hidden border-2 transition-colors ${
                selected === photo
                  ? "border-sunrust"
                  : "border-transparent hover:border-sunrust/30"
              }`}
            >
              <img
                src={photoUrl(photo)}
                alt={photo}
                className="w-full h-16 object-cover"
                loading="lazy"
              />
              <p className="text-[9px] text-sunrust/50 truncate px-1 py-0.5">
                {photo}
              </p>
            </button>
          ))}
          {photos.length === 0 && (
            <p className="col-span-full text-xs text-sunrust/40 text-center py-4">
              NO PHOTOS FOUND
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   GALLERY PICKER
   ═══════════════════════════════════════════════════ */

function GalleryPicker({
  photos,
  selected,
  onChange,
}: {
  photos: string[];
  selected: string[];
  onChange: (gallery: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <label className={labelClass}>ADDITIONAL IMAGES</label>
      {selected.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-2">
          {selected.map((photo, i) => (
            <div key={`${photo}-${i}`} className="relative group">
              <img
                src={photoUrl(photo)}
                alt={photo}
                className="w-20 h-16 object-cover rounded border border-sunrust/20"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 rounded">
                {i > 0 && (
                  <button
                    type="button"
                    className="text-white text-xs"
                    onClick={() => {
                      const next = [...selected];
                      const [moved] = next.splice(i, 1);
                      next.splice(i - 1, 0, moved);
                      onChange(next);
                    }}
                  >
                    &lt;
                  </button>
                )}
                <button
                  type="button"
                  className="text-red-400 text-xs"
                  onClick={() =>
                    onChange(selected.filter((_, idx) => idx !== i))
                  }
                >
                  x
                </button>
                {i < selected.length - 1 && (
                  <button
                    type="button"
                    className="text-white text-xs"
                    onClick={() => {
                      const next = [...selected];
                      const [moved] = next.splice(i, 1);
                      next.splice(i + 1, 0, moved);
                      onChange(next);
                    }}
                  >
                    &gt;
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        className={btnSecondary}
        onClick={() => setOpen(!open)}
      >
        + ADD IMAGE
      </button>
      {open && (
        <div className="mt-2 grid grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto border border-sunrust/10 rounded p-2">
          {photos.map((photo) => (
            <button
              key={photo}
              type="button"
              onClick={() => {
                if (!selected.includes(photo))
                  onChange([...selected, photo]);
                setOpen(false);
              }}
              className="rounded overflow-hidden border-2 border-transparent hover:border-sunrust/30 transition-colors"
            >
              <img
                src={photoUrl(photo)}
                alt={photo}
                className="w-full h-14 object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SETTINGS TAB
   ═══════════════════════════════════════════════════ */

export function SettingsTab({ password, showToast }: TabProps) {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const [hero, setHero] = useState({
    tagline: "",
    coordinates: "",
    location: "",
  });
  const [approach, setApproach] = useState({
    line1: "",
    line2: "",
    subtitle: "",
  });
  const [transition, setTransition] = useState({ line1: "", line2: "" });
  const [identity, setIdentity] = useState({
    established: "",
    blurb: "",
    image: "",
    imageAlt: "",
  });

  useEffect(() => {
    Promise.all([
      api<Record<string, unknown>>("settings"),
      fetchStoragePhotos(),
    ]).then(([settingsRes, storagePhotos]) => {
      if (settingsRes.data) {
        const s = settingsRes.data;
        setSettings({
          contact: (s.contact as SiteSettings["contact"]) ?? {},
          hours: (s.hours as HoursData) ?? { days: DEFAULT_DAYS },
          social: (s.social as SiteSettings["social"]) ?? {},
          about_blurb:
            (s.about_blurb as SiteSettings["about_blurb"]) ?? {},
        });
        const h = (s.hero ?? {}) as Record<string, string>;
        setHero({
          tagline: h.tagline ?? "",
          coordinates: h.coordinates ?? "",
          location: h.location ?? "",
        });
        const a = (s.approach ?? {}) as Record<string, string>;
        setApproach({
          line1: a.line1 ?? "",
          line2: a.line2 ?? "",
          subtitle: a.subtitle ?? "",
        });
        const t = (s.transition ?? {}) as Record<string, string>;
        setTransition({ line1: t.line1 ?? "", line2: t.line2 ?? "" });
        const id = (s.identity ?? {}) as Record<string, string>;
        setIdentity({
          established: id.established ?? "",
          blurb: id.blurb ?? "",
          image: id.image ?? "",
          imageAlt: id.imageAlt ?? "",
        });
      }
      setPhotos(storagePhotos);
      setLoading(false);
    });
  }, []);

  async function saveSetting(key: string, value: unknown) {
    setSaving(key);
    const res = await api("settings", {
      method: "PUT",
      password,
      body: JSON.stringify({ key, value }),
    });
    setSaving(null);
    if (res.error) showToast(`ERROR: ${res.error}`);
    else showToast(`${key.toUpperCase()} SAVED`);
  }

  if (loading)
    return <p className="text-sunrust/40 text-sm">LOADING...</p>;

  const contact = settings.contact ?? {};
  const hours = settings.hours ?? { days: DEFAULT_DAYS };
  const social = settings.social ?? {};
  const aboutBlurb = settings.about_blurb ?? {};

  return (
    <div className="space-y-8">
      {/* Contact */}
      <section>
        <h2 className="text-lg mb-4">CONTACT</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(["address", "city", "whatsapp", "email"] as const).map(
            (field) => (
              <div key={field}>
                <label className={labelClass}>
                  {field.toUpperCase()}
                </label>
                <input
                  className={inputClass}
                  value={
                    (contact as Record<string, string>)[field] ?? ""
                  }
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      contact: {
                        ...s.contact,
                        [field]: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            ),
          )}
        </div>
        <button
          className={btnPrimary + " mt-3"}
          onClick={() => saveSetting("contact", settings.contact)}
          disabled={saving === "contact"}
        >
          {saving === "contact" ? "SAVING..." : "SAVE CONTACT"}
        </button>
      </section>

      {/* Hours */}
      <section>
        <h2 className="text-lg mb-4">OPENING HOURS</h2>
        <div className="space-y-2">
          {hours.days.map((day, i) => (
            <div key={day.day} className="flex items-center gap-3">
              <span className="w-24 text-sm">{day.day}</span>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={day.closed}
                  onChange={(e) => {
                    const next = {
                      ...hours,
                      days: [...hours.days],
                    };
                    next.days[i] = {
                      ...next.days[i],
                      closed: e.target.checked,
                    };
                    setSettings((s) => ({ ...s, hours: next }));
                  }}
                />
                CLOSED
              </label>
              {!day.closed && (
                <>
                  <input
                    type="time"
                    className={inputClass + " w-28"}
                    value={day.opens}
                    onChange={(e) => {
                      const next = {
                        ...hours,
                        days: [...hours.days],
                      };
                      next.days[i] = {
                        ...next.days[i],
                        opens: e.target.value,
                      };
                      setSettings((s) => ({ ...s, hours: next }));
                    }}
                  />
                  <span className="text-xs">TO</span>
                  <input
                    type="time"
                    className={inputClass + " w-28"}
                    value={day.closes}
                    onChange={(e) => {
                      const next = {
                        ...hours,
                        days: [...hours.days],
                      };
                      next.days[i] = {
                        ...next.days[i],
                        closes: e.target.value,
                      };
                      setSettings((s) => ({ ...s, hours: next }));
                    }}
                  />
                </>
              )}
            </div>
          ))}
        </div>
        <button
          className={btnPrimary + " mt-3"}
          onClick={() => saveSetting("hours", settings.hours)}
          disabled={saving === "hours"}
        >
          {saving === "hours" ? "SAVING..." : "SAVE HOURS"}
        </button>
      </section>

      {/* Social */}
      <section>
        <h2 className="text-lg mb-4">SOCIAL LINKS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(["instagram", "tiktok"] as const).map((field) => (
            <div key={field}>
              <label className={labelClass}>
                {field.toUpperCase()}
              </label>
              <input
                className={inputClass}
                value={
                  (social as Record<string, string>)[field] ?? ""
                }
                placeholder={`https://${field}.com/...`}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    social: {
                      ...s.social,
                      [field]: e.target.value,
                    },
                  }))
                }
              />
            </div>
          ))}
        </div>
        <button
          className={btnPrimary + " mt-3"}
          onClick={() => saveSetting("social", settings.social)}
          disabled={saving === "social"}
        >
          {saving === "social" ? "SAVING..." : "SAVE SOCIAL"}
        </button>
      </section>

      {/* Hero */}
      <section>
        <h2 className="text-lg mb-4">HERO (GATE SCENE)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>TAGLINE</label>
            <input
              className={inputClass}
              value={hero.tagline}
              onChange={(e) =>
                setHero((h) => ({ ...h, tagline: e.target.value }))
              }
            />
          </div>
          <div>
            <label className={labelClass}>COORDINATES</label>
            <input
              className={inputClass}
              value={hero.coordinates}
              onChange={(e) =>
                setHero((h) => ({
                  ...h,
                  coordinates: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className={labelClass}>LOCATION</label>
            <input
              className={inputClass}
              value={hero.location}
              onChange={(e) =>
                setHero((h) => ({ ...h, location: e.target.value }))
              }
            />
          </div>
        </div>
        <button
          className={btnPrimary + " mt-3"}
          onClick={() => saveSetting("hero", hero)}
          disabled={saving === "hero"}
        >
          {saving === "hero" ? "SAVING..." : "SAVE HERO"}
        </button>
      </section>

      {/* Approach */}
      <section>
        <h2 className="text-lg mb-4">APPROACH SCENE</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>LINE 1</label>
            <input
              className={inputClass}
              value={approach.line1}
              onChange={(e) =>
                setApproach((a) => ({
                  ...a,
                  line1: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className={labelClass}>LINE 2</label>
            <input
              className={inputClass}
              value={approach.line2}
              onChange={(e) =>
                setApproach((a) => ({
                  ...a,
                  line2: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className={labelClass}>SUBTITLE</label>
            <input
              className={inputClass}
              value={approach.subtitle}
              onChange={(e) =>
                setApproach((a) => ({
                  ...a,
                  subtitle: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <button
          className={btnPrimary + " mt-3"}
          onClick={() => saveSetting("approach", approach)}
          disabled={saving === "approach"}
        >
          {saving === "approach" ? "SAVING..." : "SAVE APPROACH"}
        </button>
      </section>

      {/* Transition */}
      <section>
        <h2 className="text-lg mb-4">TRANSITION (TURN SCENE)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>LINE 1</label>
            <input
              className={inputClass}
              value={transition.line1}
              onChange={(e) =>
                setTransition((t) => ({
                  ...t,
                  line1: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className={labelClass}>LINE 2</label>
            <input
              className={inputClass}
              value={transition.line2}
              onChange={(e) =>
                setTransition((t) => ({
                  ...t,
                  line2: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <button
          className={btnPrimary + " mt-3"}
          onClick={() => saveSetting("transition", transition)}
          disabled={saving === "transition"}
        >
          {saving === "transition"
            ? "SAVING..."
            : "SAVE TRANSITION"}
        </button>
      </section>

      {/* Identity */}
      <section>
        <h2 className="text-lg mb-4">IDENTITY SCENE</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>ESTABLISHED</label>
              <input
                className={inputClass}
                value={identity.established}
                onChange={(e) =>
                  setIdentity((id) => ({
                    ...id,
                    established: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>IMAGE ALT</label>
              <input
                className={inputClass}
                value={identity.imageAlt}
                onChange={(e) =>
                  setIdentity((id) => ({
                    ...id,
                    imageAlt: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>BLURB</label>
            <textarea
              className={inputClass + " h-20 resize-y"}
              value={identity.blurb}
              onChange={(e) =>
                setIdentity((id) => ({
                  ...id,
                  blurb: e.target.value,
                }))
              }
            />
          </div>
          <ImagePicker
            photos={photos}
            selected={identity.image}
            onSelect={(img) =>
              setIdentity((id) => ({ ...id, image: img }))
            }
            label="IMAGE"
          />
          <button
            className={btnPrimary}
            onClick={() => saveSetting("identity", identity)}
            disabled={saving === "identity"}
          >
            {saving === "identity"
              ? "SAVING..."
              : "SAVE IDENTITY"}
          </button>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MENU TAB
   ═══════════════════════════════════════════════════ */

export function MenuTab({ password, showToast }: TabProps) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatTitle, setNewCatTitle] = useState("");
  const [addingItem, setAddingItem] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editItem, setEditItem] = useState({
    name: "",
    description: "",
    price: "",
  });

  const loadMenu = useCallback(async () => {
    const res = await api<MenuCategory[]>("menu");
    if (res.data) setCategories(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  async function addCategory() {
    if (!newCatTitle.trim()) return;
    const res = await api("menu", {
      method: "POST",
      password,
      body: JSON.stringify({
        title: newCatTitle.trim(),
        sort_order: categories.length,
      }),
    });
    if (res.error) showToast(`ERROR: ${res.error}`);
    else {
      setNewCatTitle("");
      showToast("CATEGORY ADDED");
      loadMenu();
    }
  }

  async function addItem(categoryId: string) {
    if (!newItem.name.trim()) return;
    const cat = categories.find((c) => c.id === categoryId);
    const res = await api("menu/items", {
      method: "POST",
      password,
      body: JSON.stringify({
        category_id: categoryId,
        name: newItem.name.trim(),
        description: newItem.description.trim(),
        price: newItem.price.trim(),
        sort_order: cat?.items.length ?? 0,
      }),
    });
    if (res.error) showToast(`ERROR: ${res.error}`);
    else {
      setNewItem({ name: "", description: "", price: "" });
      setAddingItem(null);
      showToast("ITEM ADDED");
      loadMenu();
    }
  }

  async function updateItem(id: string) {
    const res = await api("menu/items", {
      method: "PUT",
      password,
      body: JSON.stringify({
        id,
        name: editItem.name.trim(),
        description: editItem.description.trim(),
        price: editItem.price.trim(),
      }),
    });
    if (res.error) showToast(`ERROR: ${res.error}`);
    else {
      setEditingItem(null);
      showToast("ITEM UPDATED");
      loadMenu();
    }
  }

  async function deleteItem(id: string) {
    const res = await api("menu/items?id=" + id, {
      method: "DELETE",
      password,
    });
    if (res.error) showToast(`ERROR: ${res.error}`);
    else {
      showToast("ITEM DELETED");
      loadMenu();
    }
  }

  if (loading)
    return <p className="text-sunrust/40 text-sm">LOADING...</p>;

  return (
    <div className="space-y-6">
      {/* Add category */}
      <div className="flex gap-2">
        <input
          className={inputClass + " flex-1"}
          placeholder="NEW CATEGORY NAME"
          value={newCatTitle}
          onChange={(e) => setNewCatTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCategory()}
        />
        <button className={btnPrimary} onClick={addCategory}>
          + ADD CATEGORY
        </button>
      </div>

      {/* Categories + items */}
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="border border-sunrust/10 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-medium">{cat.title}</h3>
            {cat.note && (
              <span className="text-xs text-sunrust/40">
                {cat.note}
              </span>
            )}
          </div>

          {/* Items list */}
          <div className="space-y-2 mb-3">
            {cat.items.map((item) => (
              <div key={item.id}>
                {editingItem === item.id ? (
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className={labelClass}>NAME</label>
                      <input
                        className={inputClass}
                        value={editItem.name}
                        onChange={(e) =>
                          setEditItem((i) => ({
                            ...i,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <label className={labelClass}>
                        DESCRIPTION
                      </label>
                      <input
                        className={inputClass}
                        value={editItem.description}
                        onChange={(e) =>
                          setEditItem((i) => ({
                            ...i,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="w-28">
                      <label className={labelClass}>PRICE</label>
                      <input
                        className={inputClass}
                        value={editItem.price}
                        onChange={(e) =>
                          setEditItem((i) => ({
                            ...i,
                            price: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <button
                      className={btnPrimary}
                      onClick={() => updateItem(item.id)}
                    >
                      SAVE
                    </button>
                    <button
                      className={btnSecondary}
                      onClick={() => setEditingItem(null)}
                    >
                      CANCEL
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 py-1 border-b border-sunrust/5">
                    <span className="flex-1 text-sm">
                      {item.name}
                    </span>
                    <span className="text-xs text-sunrust/50 flex-1">
                      {item.description}
                    </span>
                    <span className="text-sm text-[#008134] w-20 text-right">
                      {item.price}
                    </span>
                    <button
                      className="text-xs text-sunrust/40 hover:text-sunrust"
                      onClick={() => {
                        setEditingItem(item.id);
                        setEditItem({
                          name: item.name,
                          description: item.description,
                          price: item.price,
                        });
                      }}
                    >
                      EDIT
                    </button>
                    <button
                      className="text-xs text-red-600 hover:text-red-800"
                      onClick={() => deleteItem(item.id)}
                    >
                      DELETE
                    </button>
                  </div>
                )}
              </div>
            ))}
            {cat.items.length === 0 && (
              <p className="text-xs text-sunrust/30 py-2">
                NO ITEMS YET
              </p>
            )}
          </div>

          {/* Add item inline */}
          {addingItem === cat.id ? (
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className={labelClass}>NAME</label>
                <input
                  className={inputClass}
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem((i) => ({
                      ...i,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex-1">
                <label className={labelClass}>DESCRIPTION</label>
                <input
                  className={inputClass}
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem((i) => ({
                      ...i,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="w-28">
                <label className={labelClass}>PRICE</label>
                <input
                  className={inputClass}
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem((i) => ({
                      ...i,
                      price: e.target.value,
                    }))
                  }
                />
              </div>
              <button
                className={btnPrimary}
                onClick={() => addItem(cat.id)}
              >
                ADD
              </button>
              <button
                className={btnSecondary}
                onClick={() => {
                  setAddingItem(null);
                  setNewItem({
                    name: "",
                    description: "",
                    price: "",
                  });
                }}
              >
                CANCEL
              </button>
            </div>
          ) : (
            <button
              className={btnSecondary + " text-xs"}
              onClick={() => {
                setAddingItem(cat.id);
                setNewItem({
                  name: "",
                  description: "",
                  price: "",
                });
              }}
            >
              + ADD ITEM
            </button>
          )}
        </div>
      ))}

      {categories.length === 0 && (
        <p className="text-sunrust/40 text-sm text-center py-8">
          NO CATEGORIES — ADD ONE ABOVE
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   JOURNAL TAB
   ═══════════════════════════════════════════════════ */

export function JournalTab({ password, showToast }: TabProps) {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<JournalPost | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    image_url: "",
    video_url: "",
    status: "draft",
  });

  const loadPosts = useCallback(async () => {
    const res = await api<JournalPost[]>("posts?all=true");
    if (res.data) {
      if (res.data.length === 0) {
        for (const seed of SEED_POSTS) {
          await api("posts", {
            method: "POST",
            password,
            body: JSON.stringify(seed),
          });
        }
        const retry = await api<JournalPost[]>("posts?all=true");
        if (retry.data) setPosts(retry.data);
      } else {
        setPosts(res.data);
      }
    }
    setLoading(false);
  }, [password]);

  useEffect(() => {
    Promise.all([
      loadPosts(),
      fetchStoragePhotos(),
      fetchStorageVideos(),
    ]).then(([, storagePhotos, storageVideos]) => {
      setPhotos(storagePhotos);
      setVideos(storageVideos);
    });
  }, [loadPosts]);

  function startEdit(post: JournalPost) {
    setEditing(post);
    setGallery(parseGallery(post.content));
    setCreating(false);
  }

  async function savePost() {
    if (!editing) return;
    const content =
      gallery.length > 0
        ? serializeGallery(gallery, editing.content)
        : editing.content;
    const res = await api("posts", {
      method: "PUT",
      password,
      body: JSON.stringify({ ...editing, content }),
    });
    if (res.error) showToast(`ERROR: ${res.error}`);
    else {
      showToast("POST SAVED");
      setEditing(null);
      loadPosts();
    }
  }

  async function createPost() {
    if (!newPost.title.trim()) return;
    const slug = newPost.slug.trim() || slugify(newPost.title);
    const res = await api("posts", {
      method: "POST",
      password,
      body: JSON.stringify({ ...newPost, slug }),
    });
    if (res.error) showToast(`ERROR: ${res.error}`);
    else {
      showToast("POST CREATED");
      setCreating(false);
      setNewPost({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "",
        author: "",
        image_url: "",
        video_url: "",
        status: "draft",
      });
      loadPosts();
    }
  }

  async function deletePost(id: string) {
    const res = await api("posts?id=" + id, {
      method: "DELETE",
      password,
    });
    if (res.error) showToast(`ERROR: ${res.error}`);
    else {
      showToast("POST DELETED");
      if (editing?.id === id) setEditing(null);
      loadPosts();
    }
  }

  if (loading)
    return <p className="text-sunrust/40 text-sm">LOADING...</p>;

  // Editing view
  if (editing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg">EDIT POST</h2>
          <button
            className={btnSecondary}
            onClick={() => setEditing(null)}
          >
            BACK TO LIST
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>TITLE</label>
            <input
              className={inputClass}
              value={editing.title}
              onChange={(e) =>
                setEditing({ ...editing, title: e.target.value })
              }
            />
          </div>
          <div>
            <label className={labelClass}>SLUG</label>
            <input
              className={inputClass}
              value={editing.slug}
              onChange={(e) =>
                setEditing({ ...editing, slug: e.target.value })
              }
            />
          </div>
          <div>
            <label className={labelClass}>CATEGORY</label>
            <input
              className={inputClass}
              value={editing.category}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  category: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>AUTHOR</label>
            <input
              className={inputClass}
              value={editing.author}
              onChange={(e) =>
                setEditing({ ...editing, author: e.target.value })
              }
            />
          </div>
          <div>
            <label className={labelClass}>STATUS</label>
            <select
              className={inputClass}
              value={editing.status}
              onChange={(e) =>
                setEditing({ ...editing, status: e.target.value })
              }
            >
              <option value="draft">DRAFT</option>
              <option value="published">PUBLISHED</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>EXCERPT</label>
          <textarea
            className={inputClass + " h-16 resize-y"}
            value={editing.excerpt}
            onChange={(e) =>
              setEditing({ ...editing, excerpt: e.target.value })
            }
          />
        </div>
        <div>
          <label className={labelClass}>CONTENT</label>
          <textarea
            className={inputClass + " h-32 resize-y"}
            value={editing.content}
            onChange={(e) =>
              setEditing({ ...editing, content: e.target.value })
            }
          />
        </div>
        <ImagePicker
          photos={photos}
          selected={editing.image_url}
          onSelect={(img) =>
            setEditing({ ...editing, image_url: img })
          }
          label="COVER IMAGE"
        />
        <div>
          <label className={labelClass}>VIDEO</label>
          <select
            className={inputClass}
            value={editing.video_url}
            onChange={(e) =>
              setEditing({ ...editing, video_url: e.target.value })
            }
          >
            <option value="">NONE</option>
            {videos.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <GalleryPicker
          photos={photos}
          selected={gallery}
          onChange={setGallery}
        />
        <div className="flex gap-2">
          <button className={btnPrimary} onClick={savePost}>
            SAVE POST
          </button>
          <button
            className={btnDanger}
            onClick={() => deletePost(editing.id)}
          >
            DELETE POST
          </button>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg">
          JOURNAL POSTS ({posts.length})
        </h2>
        <button
          className={btnPrimary}
          onClick={() => setCreating(!creating)}
        >
          {creating ? "CANCEL" : "+ NEW POST"}
        </button>
      </div>

      {/* Create form */}
      {creating && (
        <div className="border border-sunrust/10 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>TITLE</label>
              <input
                className={inputClass}
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
              />
            </div>
            <div>
              <label className={labelClass}>
                SLUG (AUTO IF EMPTY)
              </label>
              <input
                className={inputClass}
                value={newPost.slug}
                onChange={(e) =>
                  setNewPost({ ...newPost, slug: e.target.value })
                }
              />
            </div>
            <div>
              <label className={labelClass}>CATEGORY</label>
              <input
                className={inputClass}
                value={newPost.category}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    category: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>STATUS</label>
              <select
                className={inputClass}
                value={newPost.status}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    status: e.target.value,
                  })
                }
              >
                <option value="draft">DRAFT</option>
                <option value="published">PUBLISHED</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>EXCERPT</label>
            <input
              className={inputClass}
              value={newPost.excerpt}
              onChange={(e) =>
                setNewPost({ ...newPost, excerpt: e.target.value })
              }
            />
          </div>
          <button className={btnPrimary} onClick={createPost}>
            CREATE POST
          </button>
        </div>
      )}

      {/* Posts list */}
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex items-center gap-4 border border-sunrust/10 rounded-lg p-3"
        >
          {post.image_url && (
            <img
              src={photoUrl(post.image_url)}
              alt=""
              className="w-16 h-12 object-cover rounded"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {post.title}
            </p>
            <p className="text-xs text-sunrust/40">
              {post.category} &middot; {post.status}
            </p>
          </div>
          <button
            className={btnSecondary + " text-xs"}
            onClick={() => startEdit(post)}
          >
            EDIT
          </button>
          <button
            className="text-xs text-red-600 hover:text-red-800"
            onClick={() => deletePost(post.id)}
          >
            DELETE
          </button>
        </div>
      ))}

      {posts.length === 0 && (
        <p className="text-sunrust/40 text-sm text-center py-8">
          NO POSTS
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PLAYLISTS TAB
   ═══════════════════════════════════════════════════ */

export function PlaylistsTab({ password, showToast }: TabProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Playlist | null>(null);
  const [creating, setCreating] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    title: "",
    description: "",
    track_count: 0,
    duration: "",
    spotify_url: "",
    color: "#6D0000",
  });

  const loadPlaylists = useCallback(async () => {
    const res = await api<Playlist[]>("playlists");
    if (res.data) setPlaylists(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  async function createPlaylist() {
    if (!newPlaylist.title.trim()) return;
    const res = await api("playlists", {
      method: "POST",
      password,
      body: JSON.stringify({
        ...newPlaylist,
        sort_order: playlists.length,
      }),
    });
    if (res.error) showToast(`ERROR: ${res.error}`);
    else {
      showToast("PLAYLIST ADDED");
      setCreating(false);
      setNewPlaylist({
        title: "",
        description: "",
        track_count: 0,
        duration: "",
        spotify_url: "",
        color: "#6D0000",
      });
      loadPlaylists();
    }
  }

  async function savePlaylist() {
    if (!editing) return;
    const res = await api("playlists", {
      method: "PUT",
      password,
      body: JSON.stringify(editing),
    });
    if (res.error) showToast(`ERROR: ${res.error}`);
    else {
      showToast("PLAYLIST SAVED");
      setEditing(null);
      loadPlaylists();
    }
  }

  async function deletePlaylist(id: string) {
    const res = await api("playlists?id=" + id, {
      method: "DELETE",
      password,
    });
    if (res.error) showToast(`ERROR: ${res.error}`);
    else {
      showToast("PLAYLIST DELETED");
      if (editing?.id === id) setEditing(null);
      loadPlaylists();
    }
  }

  if (loading)
    return <p className="text-sunrust/40 text-sm">LOADING...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg">
          PLAYLISTS ({playlists.length})
        </h2>
        <button
          className={btnPrimary}
          onClick={() => setCreating(!creating)}
        >
          {creating ? "CANCEL" : "+ NEW PLAYLIST"}
        </button>
      </div>

      {/* Create form */}
      {creating && (
        <div className="border border-sunrust/10 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>TITLE</label>
              <input
                className={inputClass}
                value={newPlaylist.title}
                onChange={(e) =>
                  setNewPlaylist({
                    ...newPlaylist,
                    title: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>SPOTIFY URL</label>
              <input
                className={inputClass}
                value={newPlaylist.spotify_url}
                onChange={(e) =>
                  setNewPlaylist({
                    ...newPlaylist,
                    spotify_url: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>TRACK COUNT</label>
              <input
                type="number"
                className={inputClass}
                value={newPlaylist.track_count}
                onChange={(e) =>
                  setNewPlaylist({
                    ...newPlaylist,
                    track_count: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>DURATION</label>
              <input
                className={inputClass}
                placeholder="1h 23m"
                value={newPlaylist.duration}
                onChange={(e) =>
                  setNewPlaylist({
                    ...newPlaylist,
                    duration: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>COLOR</label>
              <input
                type="color"
                className="w-12 h-9 border border-sunrust/20 rounded cursor-pointer"
                value={newPlaylist.color}
                onChange={(e) =>
                  setNewPlaylist({
                    ...newPlaylist,
                    color: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>DESCRIPTION</label>
            <textarea
              className={inputClass + " h-16 resize-y"}
              value={newPlaylist.description}
              onChange={(e) =>
                setNewPlaylist({
                  ...newPlaylist,
                  description: e.target.value,
                })
              }
            />
          </div>
          <button className={btnPrimary} onClick={createPlaylist}>
            CREATE PLAYLIST
          </button>
        </div>
      )}

      {/* Playlists list */}
      {playlists.map((pl) => (
        <div
          key={pl.id}
          className="border border-sunrust/10 rounded-lg p-4"
        >
          {editing?.id === pl.id ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>TITLE</label>
                  <input
                    className={inputClass}
                    value={editing.title}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>SPOTIFY URL</label>
                  <input
                    className={inputClass}
                    value={editing.spotify_url}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        spotify_url: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>TRACK COUNT</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={editing.track_count}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        track_count:
                          parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>DURATION</label>
                  <input
                    className={inputClass}
                    value={editing.duration}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        duration: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>COLOR</label>
                  <input
                    type="color"
                    className="w-12 h-9 border border-sunrust/20 rounded cursor-pointer"
                    value={editing.color}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        color: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>SORT ORDER</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={editing.sort_order}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        sort_order:
                          parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>DESCRIPTION</label>
                <textarea
                  className={inputClass + " h-16 resize-y"}
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex gap-2">
                <button
                  className={btnPrimary}
                  onClick={savePlaylist}
                >
                  SAVE
                </button>
                <button
                  className={btnSecondary}
                  onClick={() => setEditing(null)}
                >
                  CANCEL
                </button>
                <button
                  className={btnDanger}
                  onClick={() => deletePlaylist(pl.id)}
                >
                  DELETE
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div
                className="w-3 h-10 rounded"
                style={{ backgroundColor: pl.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{pl.title}</p>
                <p className="text-xs text-sunrust/40">
                  {pl.track_count} tracks &middot; {pl.duration}
                </p>
              </div>
              {pl.spotify_url && (
                <a
                  href={pl.spotify_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-sunrust/40 hover:text-sunrust"
                >
                  SPOTIFY
                </a>
              )}
              <button
                className={btnSecondary + " text-xs"}
                onClick={() => setEditing(pl)}
              >
                EDIT
              </button>
            </div>
          )}
        </div>
      ))}

      {playlists.length === 0 && (
        <p className="text-sunrust/40 text-sm text-center py-8">
          NO PLAYLISTS — ADD ONE ABOVE
        </p>
      )}
    </div>
  );
}
