/**
 * Seeds Alice's missing content into the live Supabase database.
 * Run: npx tsx scripts/seed-alice-content.ts
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function getCategoryId(title: string): Promise<string> {
  const { data, error } = await supabase
    .from("menu_categories")
    .select("id")
    .eq("title", title)
    .single();
  if (error || !data) throw new Error(`Category "${title}" not found`);
  return data.id;
}

async function seedMenuItems() {
  console.log("Adding missing menu items...");

  const kitchen = await getCategoryId("Kitchen");
  const sweets = await getCategoryId("Sweets");
  const coffee = await getCategoryId("Coffee");
  const herbal = await getCategoryId("Herbal & Tea");
  const drinks = await getCategoryId("Drinks");

  const items = [
    { category_id: kitchen, name: "Bubur Ayam", description: "Rice porridge, shredded chicken, soft-boiled egg, krupuk", price: "70k", sort_order: 3 },
    { category_id: kitchen, name: "Chicken Sandwich", description: "Baguette, pulled Taliwang BBQ chicken, coleslaw", price: "75k", sort_order: 5 },
    { category_id: kitchen, name: "Grilled Cheese", description: "Sourdough, three-cheese blend, kimchi mayo", price: "70k", sort_order: 9 },
    { category_id: kitchen, name: "Fruit Plate", description: "Fresh local fruit selection", price: "50k", sort_order: 11 },
    { category_id: sweets, name: "Cheesecake", description: null, price: "40k", sort_order: 2 },
    { category_id: sweets, name: "Bread Pudding", description: "Caramel, vanilla cream", price: "45k", sort_order: 3 },
    { category_id: coffee, name: "Yuzu Matcha", description: null, price: "45k", sort_order: 4 },
    { category_id: herbal, name: "English Breakfast", description: null, price: "20k", sort_order: 3 },
    { category_id: drinks, name: "Cucumber Cooler", description: null, price: "35k", sort_order: 2 },
  ];

  // Skip items that already exist
  for (const item of items) {
    const { data: existing } = await supabase
      .from("menu_items")
      .select("id")
      .eq("name", item.name)
      .eq("category_id", item.category_id)
      .maybeSingle();

    if (existing) {
      console.log(`  ✓ "${item.name}" already exists, skipping`);
      continue;
    }

    const { error } = await supabase
      .from("menu_items")
      .insert({ ...item, is_active: true });

    if (error) {
      console.error(`  ✗ "${item.name}":`, error.message);
    } else {
      console.log(`  + "${item.name}" added`);
    }
  }
}

async function updatePlaylists() {
  console.log("\nUpdating playlist Spotify URLs...");

  const updates = [
    {
      match: "Morning",
      title: "Bukito Morning",
      description: "Slow start, soft light, coffee machine humming",
      spotify_url: "https://open.spotify.com/playlist/3N2LttneuZiP5eGCX8YM9c",
    },
    {
      match: "Afternoon",
      title: "Bukito Afternoon",
      description: "Post surf, cold brew, island breeze",
      spotify_url: "https://open.spotify.com/playlist/6pVSHv2WyaQsBh6pqkYH0g",
    },
    {
      match: "Sunset",
      title: "Bukito Sunset",
      description: "Golden light aperitivo 'til way after sundown",
      spotify_url: "https://open.spotify.com/playlist/4FTDiiWa8hlxpjNUhb7cGB",
    },
  ];

  for (const { match, title, description, spotify_url } of updates) {
    const { error } = await supabase
      .from("playlists")
      .update({ title, description, spotify_url })
      .ilike("title", `%${match}%`);

    if (error) {
      console.error(`  ✗ "${title}":`, error.message);
    } else {
      console.log(`  ✓ "${title}" updated with real Spotify URL`);
    }
  }
}

async function fixBlogImage() {
  console.log("\nFixing KL Food Crawl image...");

  const { error } = await supabase
    .from("blog_posts")
    .update({ image_url: "BUKITO_IG12.webp" })
    .eq("slug", "kl-food-crawl");

  if (error) {
    console.error("  ✗", error.message);
  } else {
    console.log("  ✓ KL Food Crawl image set to BUKITO_IG12.webp");
  }
}

async function verify() {
  console.log("\n--- Verification ---");

  const { count: menuCount } = await supabase
    .from("menu_items")
    .select("*", { count: "exact", head: true });
  console.log(`Menu items: ${menuCount} (expected 36)`);

  const { data: playlists } = await supabase
    .from("playlists")
    .select("title, spotify_url")
    .order("sort_order");
  for (const p of playlists ?? []) {
    const hasReal = p.spotify_url?.includes("/playlist/");
    console.log(`Playlist "${p.title}": ${hasReal ? "✓ real URL" : "✗ placeholder"}`);
  }

  const { data: blog } = await supabase
    .from("blog_posts")
    .select("slug, image_url")
    .eq("slug", "kl-food-crawl")
    .single();
  console.log(`KL Food Crawl image: ${blog?.image_url} (expected BUKITO_IG12.webp)`);
}

async function main() {
  console.log("=== Seeding Alice's content ===\n");
  await seedMenuItems();
  await updatePlaylists();
  await fixBlogImage();
  await verify();
  console.log("\nDone!");
}

main().catch(console.error);
