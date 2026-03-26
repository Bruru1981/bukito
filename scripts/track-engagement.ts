/**
 * Bukito Instagram Analytics Tracker
 *
 * Calculates engagement rate and stores post data in Supabase.
 * Usage:
 *   npx tsx track-engagement.ts
 *
 * Environment variables required:
 *   SUPABASE_URL      — Supabase project URL
 *   SUPABASE_KEY      — Supabase service_role key (for server-side inserts)
 */

import { createClient } from "@supabase/supabase-js";

// ---------- Types ----------

type Platform = "instagram" | "tiktok";
type PostType = "menu_highlight" | "vibe" | "event" | "quote" | "brand" | "story";
type ContentPillar = "food" | "vibe" | "village" | "brand";

interface PostInput {
  postDate: string; // ISO 8601 date string
  platform: Platform;
  postType: PostType;
  contentPillar: ContentPillar;
  caption: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  reach: number;
  followersCount: number;
  notes?: string;
}

interface ContentAnalyticsRow {
  post_date: string;
  platform: Platform;
  post_type: PostType;
  content_pillar: ContentPillar;
  caption: string;
  image_url: string | null;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  reach: number;
  engagement_rate: number;
  notes: string | null;
}

// ---------- Supabase Client ----------

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_KEY environment variables.\n" +
        "Set them before running this script:\n" +
        "  export SUPABASE_URL=https://glmgwaywptqlzudoiwot.supabase.co\n" +
        "  export SUPABASE_KEY=<your-service-role-key>"
    );
  }

  return createClient(url, key);
}

// ---------- Core Logic ----------

/**
 * Calculate engagement rate as a percentage.
 * Formula: (likes + comments + saves) / followers * 100
 */
function calculateEngagementRate(
  likes: number,
  comments: number,
  saves: number,
  followersCount: number
): number {
  if (followersCount <= 0) {
    throw new Error("Followers count must be greater than 0");
  }
  const rate = ((likes + comments + saves) / followersCount) * 100;
  return Math.round(rate * 100) / 100; // Round to 2 decimal places
}

/**
 * Validate post input data before inserting.
 */
function validateInput(input: PostInput): void {
  const validPlatforms: Platform[] = ["instagram", "tiktok"];
  const validPostTypes: PostType[] = ["menu_highlight", "vibe", "event", "quote", "brand", "story"];
  const validPillars: ContentPillar[] = ["food", "vibe", "village", "brand"];

  if (!validPlatforms.includes(input.platform)) {
    throw new Error(`Invalid platform: ${input.platform}. Must be one of: ${validPlatforms.join(", ")}`);
  }
  if (!validPostTypes.includes(input.postType)) {
    throw new Error(`Invalid post type: ${input.postType}. Must be one of: ${validPostTypes.join(", ")}`);
  }
  if (!validPillars.includes(input.contentPillar)) {
    throw new Error(`Invalid content pillar: ${input.contentPillar}. Must be one of: ${validPillars.join(", ")}`);
  }
  if (input.followersCount <= 0) {
    throw new Error("Followers count must be a positive number");
  }
  if (!input.caption.trim()) {
    throw new Error("Caption cannot be empty");
  }

  // Validate date
  const date = new Date(input.postDate);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${input.postDate}`);
  }
}

/**
 * Track a post's engagement by calculating the rate and inserting into Supabase.
 */
async function trackEngagement(input: PostInput): Promise<ContentAnalyticsRow> {
  validateInput(input);

  const engagementRate = calculateEngagementRate(
    input.likes,
    input.comments,
    input.saves,
    input.followersCount
  );

  const row: ContentAnalyticsRow = {
    post_date: input.postDate,
    platform: input.platform,
    post_type: input.postType,
    content_pillar: input.contentPillar,
    caption: input.caption,
    image_url: input.imageUrl ?? null,
    likes: input.likes,
    comments: input.comments,
    saves: input.saves,
    shares: input.shares,
    reach: input.reach,
    engagement_rate: engagementRate,
    notes: input.notes ?? null,
  };

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("content_analytics")
    .insert(row)
    .select()
    .single();

  if (error) {
    throw new Error(`Supabase insert failed: ${error.message}`);
  }

  console.log(`Tracked: ${input.platform} ${input.postType} (${input.contentPillar})`);
  console.log(`  Engagement: ${engagementRate}% (${input.likes}L + ${input.comments}C + ${input.saves}S / ${input.followersCount} followers)`);
  console.log(`  Reach: ${input.reach}`);
  console.log(`  ID: ${data.id}`);

  return data;
}

// ---------- Query Helpers ----------

/**
 * Get best performing posts by engagement rate.
 */
async function getTopPosts(limit = 10, platform?: Platform) {
  const supabase = getSupabaseClient();

  let query = supabase
    .from("content_analytics")
    .select("*")
    .order("engagement_rate", { ascending: false })
    .limit(limit);

  if (platform) {
    query = query.eq("platform", platform);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Query failed: ${error.message}`);
  return data;
}

/**
 * Get average engagement by content pillar.
 */
async function getEngagementByPillar() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("content_analytics")
    .select("content_pillar, engagement_rate");

  if (error) throw new Error(`Query failed: ${error.message}`);

  // Group and average in JS (Supabase JS client doesn't support GROUP BY)
  const groups: Record<string, { total: number; count: number }> = {};
  for (const row of data ?? []) {
    const pillar = row.content_pillar;
    if (!groups[pillar]) groups[pillar] = { total: 0, count: 0 };
    groups[pillar].total += Number(row.engagement_rate);
    groups[pillar].count += 1;
  }

  return Object.entries(groups).map(([pillar, stats]) => ({
    pillar,
    avgEngagement: Math.round((stats.total / stats.count) * 100) / 100,
    postCount: stats.count,
  }));
}

/**
 * Get average engagement by post type.
 */
async function getEngagementByPostType() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("content_analytics")
    .select("post_type, engagement_rate");

  if (error) throw new Error(`Query failed: ${error.message}`);

  const groups: Record<string, { total: number; count: number }> = {};
  for (const row of data ?? []) {
    const postType = row.post_type;
    if (!groups[postType]) groups[postType] = { total: 0, count: 0 };
    groups[postType].total += Number(row.engagement_rate);
    groups[postType].count += 1;
  }

  return Object.entries(groups)
    .map(([postType, stats]) => ({
      postType,
      avgEngagement: Math.round((stats.total / stats.count) * 100) / 100,
      postCount: stats.count,
    }))
    .sort((a, b) => b.avgEngagement - a.avgEngagement);
}

// ---------- CLI Entry Point ----------

async function main() {
  const args = process.argv.slice(2);

  if (args[0] === "top") {
    const limit = parseInt(args[1] ?? "10", 10);
    const posts = await getTopPosts(limit);
    console.log(`\nTop ${limit} posts by engagement:\n`);
    for (const post of posts ?? []) {
      console.log(`  ${post.engagement_rate}% | ${post.platform} | ${post.post_type} | ${post.content_pillar}`);
      console.log(`    "${post.caption.substring(0, 60)}..."`);
    }
    return;
  }

  if (args[0] === "by-pillar") {
    const stats = await getEngagementByPillar();
    console.log("\nAvg engagement by content pillar:\n");
    for (const s of stats) {
      console.log(`  ${s.pillar}: ${s.avgEngagement}% (${s.postCount} posts)`);
    }
    return;
  }

  if (args[0] === "by-type") {
    const stats = await getEngagementByPostType();
    console.log("\nAvg engagement by post type:\n");
    for (const s of stats) {
      console.log(`  ${s.postType}: ${s.avgEngagement}% (${s.postCount} posts)`);
    }
    return;
  }

  // Default: track a sample post (for testing)
  if (args[0] === "sample") {
    await trackEngagement({
      postDate: new Date().toISOString(),
      platform: "instagram",
      postType: "vibe",
      contentPillar: "vibe",
      caption: "SOME MORNINGS THE OCEAN IS SO STILL YOU CAN HEAR THE COFFEE BREWING",
      likes: 47,
      comments: 8,
      saves: 12,
      shares: 3,
      reach: 380,
      followersCount: 500,
      notes: "Sample post for testing",
    });
    return;
  }

  console.log(`
Bukito Engagement Tracker

Usage:
  npx tsx track-engagement.ts sample          — Insert a sample post
  npx tsx track-engagement.ts top [n]         — Show top N posts by engagement
  npx tsx track-engagement.ts by-pillar       — Avg engagement by content pillar
  npx tsx track-engagement.ts by-type         — Avg engagement by post type

Environment:
  SUPABASE_URL    — Your Supabase project URL
  SUPABASE_KEY    — Service role key

For programmatic use, import trackEngagement() from this module.
  `);
}

// ---------- Exports ----------

export {
  trackEngagement,
  getTopPosts,
  getEngagementByPillar,
  getEngagementByPostType,
  calculateEngagementRate,
  type PostInput,
  type ContentAnalyticsRow,
  type Platform,
  type PostType,
  type ContentPillar,
};

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
