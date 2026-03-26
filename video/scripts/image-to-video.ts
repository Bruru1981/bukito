#!/usr/bin/env npx tsx
/**
 * Bukito Image-to-Video Generator
 * Uses Runway Gen-4 API to turn Bukito photos into cinematic video clips
 *
 * Usage:
 *   npx tsx scripts/image-to-video.ts <photo> [prompt] [duration] [ratio]
 *
 * Examples:
 *   npx tsx scripts/image-to-video.ts BUKITO_IG1.webp
 *   npx tsx scripts/image-to-video.ts BUKITO_IG1.webp "slow camera pan right, tropical breeze"
 *   npx tsx scripts/image-to-video.ts bukito-exterior.webp "cinematic dolly forward" 10 720:1280
 */

import * as fs from "fs";
import * as path from "path";
import * as os from "os";

// Load API key from ~/.claude/api-keys.conf (global) or .env (local)
function loadApiKey(): string | undefined {
  // Try global api-keys.conf first
  const globalConf = path.join(os.homedir(), ".claude", "api-keys.conf");
  if (fs.existsSync(globalConf)) {
    const content = fs.readFileSync(globalConf, "utf-8");
    const match = content.match(/^RUNWAY_API_KEY=(.+)$/m);
    if (match) return match[1].trim();
  }
  // Fallback to .env
  const localEnv = path.join(__dirname, "..", ".env");
  if (fs.existsSync(localEnv)) {
    const content = fs.readFileSync(localEnv, "utf-8");
    const match = content.match(/^RUNWAY_API_KEY=(.+)$/m);
    if (match) return match[1].trim();
  }
  return process.env.RUNWAY_API_KEY;
}

const API_KEY = loadApiKey();
const API_BASE = "https://api.dev.runwayml.com/v1";
const HEADERS = {
  Authorization: `Bearer ${API_KEY}`,
  "X-Runway-Version": "2024-11-06",
  "Content-Type": "application/json",
};

// Default motion prompts per photo type
const DEFAULT_PROMPTS: Record<string, string> = {
  "BUKITO_IG1": "slow cinematic camera pan right, person walking, tropical evening atmosphere, warm film grain",
  "BUKITO_IG3": "gentle camera movement, cat sleeping peacefully, warm natural light, analog film look",
  "BUKITO_IG7": "slow dolly forward through tropical jungle path, palm trees swaying gently in breeze, golden hour light",
  "BUKITO_IG11": "slow zoom in, atmospheric evening scene, warm ambient lighting, slight movement",
  "BUKITO_IG15": "rooster walking slowly, slight camera follow, rustic tropical village, warm earthy tones",
  "BUKITO_IG19": "gentle handheld camera movement, tropical atmosphere, natural ambient motion",
  "BUKITO_IG22": "slow cinematic pan, ocean waves in background, tropical sunset colors",
  "BUKITO_IG24": "subtle camera drift, warm evening light, relaxed tropical atmosphere",
  "bukito-barista": "barista preparing coffee, gentle steam rising, warm indoor lighting, slow motion pour",
  "bukito-exterior": "slow establishing shot, tropical restaurant exterior, palm trees swaying, golden hour",
};

async function imageToDataUri(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mime = ext === "webp" ? "image/webp" : ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

async function createTask(
  imageDataUri: string,
  prompt: string,
  duration: number,
  ratio: string
): Promise<string> {
  const body = {
    model: "gen4_turbo",
    promptImage: imageDataUri,
    promptText: prompt,
    duration,
    ratio,
  };

  const res = await fetch(`${API_BASE}/image_to_video`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create task: ${res.status} ${err}`);
  }

  const data = (await res.json()) as { id: string };
  return data.id;
}

async function pollTask(taskId: string): Promise<string> {
  const maxAttempts = 120; // 10 minutes max
  let attempts = 0;

  while (attempts < maxAttempts) {
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
      headers: HEADERS,
    });

    if (!res.ok) {
      throw new Error(`Failed to poll task: ${res.status}`);
    }

    const data = (await res.json()) as {
      status: string;
      output?: string[];
      failure?: string;
      failureCode?: string;
    };

    switch (data.status) {
      case "SUCCEEDED":
        if (data.output && data.output[0]) {
          return data.output[0];
        }
        throw new Error("Task succeeded but no output URL found");

      case "FAILED":
        throw new Error(`Task failed: ${data.failure} (${data.failureCode})`);

      case "PENDING":
      case "THROTTLED":
      case "RUNNING":
        const dots = ".".repeat((attempts % 3) + 1);
        process.stdout.write(`\r  ${data.status}${dots.padEnd(4)} (${attempts * 5}s elapsed)`);
        break;
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
    attempts++;
  }

  throw new Error("Timed out waiting for video generation");
}

async function downloadVideo(url: string, outputPath: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
}

async function main() {
  if (!API_KEY) {
    console.error("ERROR: Set RUNWAY_API_KEY in .env file");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log(`
BUKITO IMAGE-TO-VIDEO GENERATOR
================================
Usage: npx tsx scripts/image-to-video.ts <photo> [prompt] [duration] [ratio]

Available photos:`);
    const photosDir = path.join(__dirname, "..", "public", "photos");
    if (fs.existsSync(photosDir)) {
      fs.readdirSync(photosDir)
        .filter((f) => !f.startsWith("."))
        .forEach((f) => {
          const name = path.parse(f).name;
          const defaultPrompt = DEFAULT_PROMPTS[name] || "cinematic slow motion, warm tropical atmosphere";
          console.log(`  ${f}`);
          console.log(`    Default prompt: "${defaultPrompt}"`);
        });
    }
    console.log(`
Ratios:
  1280:720   - Landscape (YouTube)
  720:1280   - Portrait (Instagram Reel/Story)
  960:960    - Square (Instagram Post)

Duration: 5 or 10 seconds
`);
    process.exit(0);
  }

  const photoArg = args[0];
  const photosDir = path.join(__dirname, "..", "public", "photos");
  const photoPath = fs.existsSync(photoArg)
    ? photoArg
    : path.join(photosDir, photoArg);

  if (!fs.existsSync(photoPath)) {
    console.error(`Photo not found: ${photoPath}`);
    process.exit(1);
  }

  const photoName = path.parse(photoPath).name;
  const prompt = args[1] || DEFAULT_PROMPTS[photoName] || "cinematic slow motion, warm tropical atmosphere, analog film aesthetic";
  const duration = parseInt(args[2] || "5", 10);
  const ratio = args[3] || "720:1280"; // Default to portrait for Instagram

  console.log(`
╔══════════════════════════════════════╗
║   BUKITO IMAGE-TO-VIDEO GENERATOR   ║
╚══════════════════════════════════════╝

  Photo:    ${path.basename(photoPath)}
  Prompt:   "${prompt}"
  Duration: ${duration}s
  Ratio:    ${ratio}
  Model:    gen4_turbo
`);

  // Convert image to data URI
  console.log("  Converting image...");
  const dataUri = await imageToDataUri(photoPath);

  // Create task
  console.log("  Submitting to Runway API...");
  const taskId = await createTask(dataUri, prompt, duration, ratio);
  console.log(`  Task ID: ${taskId}`);

  // Poll for completion
  console.log("  Generating video...");
  const videoUrl = await pollTask(taskId);
  console.log("\n  Video generated!");

  // Download
  const outputDir = path.join(__dirname, "..", "out", "ai-videos");
  fs.mkdirSync(outputDir, { recursive: true });
  const outputFile = path.join(outputDir, `${photoName}_${ratio.replace(":", "x")}_${Date.now()}.mp4`);

  console.log("  Downloading...");
  await downloadVideo(videoUrl, outputFile);
  console.log(`\n  Saved: ${outputFile}`);
  console.log(`\n  To use in Remotion, copy to public/videos/ and reference with staticFile()`);
}

main().catch((err) => {
  console.error("\nERROR:", err.message);
  process.exit(1);
});
