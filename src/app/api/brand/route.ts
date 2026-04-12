import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

const SETTINGS_PATH = join(process.cwd(), ".claude", "brand-settings.json");

interface PaperWorkspace {
  label: string;
  url: string;
  description: string;
}

interface BrandSettings {
  paperUrl: string;
  paperWorkspaces: PaperWorkspace[];
  colors: {
    primary: { name: string; hex: string; role: string }[];
    secondary: { name: string; hex: string; role: string }[];
  };
}

const DEFAULTS: BrandSettings = {
  paperUrl: "",
  paperWorkspaces: [
    { label: "Social Media", url: "", description: "IG posts, stories, carousels, TikTok covers" },
    { label: "Menus", url: "", description: "Restaurant menus, drink menus, specials" },
    { label: "Print", url: "", description: "Flyers, posters, business cards, signage" },
  ],
  colors: {
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
  },
};

async function readSettings(): Promise<BrandSettings> {
  try {
    const data = await readFile(SETTINGS_PATH, "utf-8");
    return { ...DEFAULTS, ...JSON.parse(data) };
  } catch {
    return DEFAULTS;
  }
}

async function writeSettings(settings: BrandSettings): Promise<void> {
  await mkdir(join(process.cwd(), ".claude"), { recursive: true });
  await writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2));
}

export async function GET() {
  const settings = await readSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const current = await readSettings();
  const updated = { ...current, ...body };
  await writeSettings(updated);
  return NextResponse.json(updated);
}
