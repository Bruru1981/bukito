#!/usr/bin/env npx tsx
/**
 * Schedule a Bukito social media post via Postiz API.
 *
 * Usage:
 *   npx tsx scripts/schedule-post.ts \
 *     --image ./exports/post-sunset.png \
 *     --caption "GOLDEN HOUR NEVER ENDS HERE" \
 *     --hashtags "Bukito,BukitoSumbawa,ParadiseWithFangs,TropicalVibes" \
 *     --at "2026-03-27T11:00:00+08:00" \
 *     --platform instagram
 *
 * Options:
 *   --image      Path to image (PNG) or video (MP4) file
 *   --caption    Post caption text
 *   --hashtags   Comma-separated hashtags (with or without #)
 *   --at         ISO 8601 scheduled time (omit to publish now)
 *   --platform   "instagram" or "tiktok" (default: instagram)
 *   --draft      Save as draft instead of scheduling
 *
 * Environment:
 *   POSTIZ_API_URL   Postiz backend URL (default: http://localhost:3000)
 *   POSTIZ_API_KEY   API key from Postiz settings
 *   POSTIZ_INTEGRATION_INSTAGRAM   Integration ID for Instagram
 *   POSTIZ_INTEGRATION_TIKTOK      Integration ID for TikTok
 */

import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { PostizClient } from "../lib/postiz-client.js";

// ---------------------------------------------------------------------------
// Parse CLI args
// ---------------------------------------------------------------------------

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--") && i + 1 < argv.length) {
      const key = arg.slice(2);
      args[key] = argv[++i];
    }
  }
  return args;
}

const args = parseArgs(process.argv);

// ---------------------------------------------------------------------------
// Validate inputs
// ---------------------------------------------------------------------------

const caption = args["caption"];
if (!caption) {
  console.error("Error: --caption is required");
  process.exit(1);
}

const imagePath = args["image"] ? resolve(args["image"]) : undefined;
if (imagePath && !existsSync(imagePath)) {
  console.error(`Error: File not found: ${imagePath}`);
  process.exit(1);
}

const hashtags = args["hashtags"]
  ? args["hashtags"].split(",").map((h) => h.trim())
  : [];

const platform = args["platform"] ?? "instagram";
const scheduledAt = args["at"];
const isDraft = "draft" in args;

// ---------------------------------------------------------------------------
// Resolve config from environment
// ---------------------------------------------------------------------------

const apiUrl = process.env["POSTIZ_API_URL"] ?? "http://localhost:3000";
const apiKey = process.env["POSTIZ_API_KEY"];

if (!apiKey) {
  console.error("Error: POSTIZ_API_KEY environment variable is required");
  console.error("  Get your API key from Postiz Settings > API Key");
  process.exit(1);
}

// Resolve integration ID based on platform
const integrationEnvKey =
  platform === "tiktok"
    ? "POSTIZ_INTEGRATION_TIKTOK"
    : "POSTIZ_INTEGRATION_INSTAGRAM";

const integrationId = process.env[integrationEnvKey];

if (!integrationId) {
  console.error(`Error: ${integrationEnvKey} environment variable is required`);
  console.error(
    "  Connect your account in Postiz UI, then find the integration ID in Settings"
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Execute
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const client = new PostizClient({ baseUrl: apiUrl, apiKey });

  const mediaFiles = imagePath ? [imagePath] : [];

  if (isDraft) {
    console.log(`Saving draft to ${platform}...`);
    const result = await client.createPost({
      type: "draft",
      posts: [
        {
          integration: { id: integrationId },
          value: [
            {
              content:
                caption +
                (hashtags.length
                  ? "\n\n" +
                    hashtags
                      .map((h) => (h.startsWith("#") ? h : `#${h}`))
                      .join(" ")
                  : ""),
            },
          ],
          settings: { __type: platform },
        },
      ],
    });
    console.log("Draft saved:", JSON.stringify(result, null, 2));
  } else if (scheduledAt) {
    console.log(`Scheduling post for ${scheduledAt} on ${platform}...`);
    const result = await client.schedulePost({
      integrationIds: [integrationId],
      caption,
      mediaFiles,
      scheduledAt,
      hashtags,
      providerType: platform,
    });
    console.log("Post scheduled:", JSON.stringify(result, null, 2));
  } else {
    console.log(`Publishing now to ${platform}...`);
    const result = await client.publishNow({
      integrationIds: [integrationId],
      caption,
      mediaFiles,
      hashtags,
      providerType: platform,
    });
    console.log("Post published:", JSON.stringify(result, null, 2));
  }
}

main().catch((err) => {
  console.error("Failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
