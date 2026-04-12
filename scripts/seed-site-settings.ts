/**
 * Seed additional site_settings keys for all v2 sections.
 * Run with: npx tsx scripts/seed-site-settings.ts
 */

const SUPABASE_URL = "https://glmgwaywptqlzudoiwot.supabase.co";
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsbWd3YXl3cHRxbHp1ZG9pd290Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNTc5MiwiZXhwIjoyMDg5OTAxNzkyfQ.pNHfKGC6WAtnnxFXUHvM0epKFKc527s2a-BXGqRC5Yo";

const settings = [
  {
    key: "hero",
    value: {
      tagline: "Paradise With Fangs",
      coordinates: "8\u00b033'S \u00b7 116\u00b047'E",
      location: "Kertasari, Sumbawa",
    },
  },
  {
    key: "approach",
    value: {
      line1: "Where The Road Ends",
      line2: "And The Snake Begins",
      subtitle: "Restaurant \u00b7 Coffee \u00b7 Kertasari",
    },
  },
  {
    key: "transition",
    value: {
      line1: "When The Sun Drops",
      line2: "The Snake Comes Out",
    },
  },
  {
    key: "gallery",
    value: {
      label: "Mornings, Surf, Sunsets, Repeat",
      heading: "Days Like These",
    },
  },
  {
    key: "journey",
    value: {
      heading: "The Journey",
      subtitle: "Near Lakey Peak, Sumbawa Barat",
      locations: [
        {
          name: "Bali",
          detail: "Fly in",
          icon: "\u2708",
          top: "30%",
          left: "17%",
          layout: "body",
        },
        {
          name: "Lombok",
          detail: "Fly or ferry",
          icon: "\u2708",
          top: "53%",
          left: "24%",
          layout: "body",
        },
        {
          name: "Sumbawa",
          detail: "Ferry, 2h",
          icon: "\u26f4",
          top: "26%",
          left: "57%",
          layout: "body",
        },
        {
          name: "Kertasari",
          detail: "Ride west, 45 min",
          icon: "\ud83c\udfcd",
          top: "78%",
          left: "43%",
          layout: "body",
        },
        {
          name: "Bukito",
          detail: "Follow the snake",
          top: "87%",
          left: "78%",
          layout: "below-mouth",
        },
      ],
    },
  },
  {
    key: "identity",
    value: {
      established: "Est. 2024 \u00b7 Kertasari",
      blurb:
        "Belgian Kitchen Meets Local Soul. Surf Town Restaurant At The End Of The Road. From Breakfast Buns To Smash Burgers, Espresso To Evening Cocktails. Where The Surf Crowd Meets The Village.",
      image: "photos/bukito-exterior.webp",
      imageAlt:
        "Bukito restaurant and coffee bar building in Kertasari, Sumbawa Barat",
    },
  },
  {
    key: "contact",
    value: {
      address: "Jl. Pantai Kertasari",
      region: "Sumbawa Barat, Nusa Tenggara Barat, Indonesia",
      hours: "Open Daily 08:00 \u2014 22:00",
      phone: "+62 822 3460 6010",
      whatsapp: "https://wa.me/6282234606010",
      tagline: "Once You're In You Will Stay",
      hashtag: "#ParadiseWithFangs",
    },
  },
  {
    key: "social",
    value: {
      links: [
        {
          label: "Instagram",
          url: "https://instagram.com/bukito.sumbawa",
        },
        {
          label: "TikTok",
          url: "https://tiktok.com/@bukito.sumbawa",
        },
        {
          label: "WhatsApp",
          url: "https://wa.me/6282234606010",
        },
      ],
    },
  },
];

async function seed() {
  console.log("Seeding site_settings...");

  const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(settings),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Failed (${res.status}):`, text);
    process.exit(1);
  }

  console.log(`Seeded ${settings.length} site_settings keys.`);
}

seed();
