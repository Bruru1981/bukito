/**
 * Postiz API Client for Bukito
 *
 * Wraps the Postiz Public API v1 for scheduling and publishing
 * social media posts programmatically.
 *
 * API docs: https://docs.postiz.com/public-api/introduction
 */

import { readFileSync } from "node:fs";
import { basename } from "node:path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PostizConfig {
  /** Base URL of the Postiz backend (e.g. http://localhost:3000) */
  baseUrl: string;
  /** API key from Postiz Settings */
  apiKey: string;
}

export interface UploadedMedia {
  id: string;
  path: string;
}

export interface PostIntegration {
  id: string;
}

export interface PostContent {
  content: string;
  image?: UploadedMedia[];
}

export interface PostEntry {
  integration: PostIntegration;
  value: PostContent[];
  settings: Record<string, unknown>;
}

export type PostType = "schedule" | "draft" | "now";

export interface CreatePostPayload {
  type: PostType;
  date?: string; // ISO 8601, required when type = "schedule"
  shortLink?: boolean;
  tags?: string[];
  posts: PostEntry[];
}

export interface PostizResponse<T> {
  data: T;
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export class PostizClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(config: PostizConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.apiKey = config.apiKey;
  }

  // ---- Helpers ------------------------------------------------------------

  private get apiBase(): string {
    return `${this.baseUrl}/public/v1`;
  }

  private headers(contentType?: string): Record<string, string> {
    const h: Record<string, string> = {
      Authorization: this.apiKey,
    };
    if (contentType) h["Content-Type"] = contentType;
    return h;
  }

  // ---- Upload -------------------------------------------------------------

  /**
   * Upload a media file (image or video) to Postiz.
   * Returns the uploaded media metadata needed for creating posts.
   */
  async uploadMedia(filePath: string): Promise<UploadedMedia> {
    const fileBuffer = readFileSync(filePath);
    const fileName = basename(filePath);

    // Determine MIME type from extension
    const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
    const mimeMap: Record<string, string> = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      webp: "image/webp",
      gif: "image/gif",
      mp4: "video/mp4",
      mov: "video/quicktime",
    };
    const mimeType = mimeMap[ext] ?? "application/octet-stream";

    // Build multipart form data manually using the Web API FormData
    // (Node 18+ supports this natively via undici)
    const blob = new Blob([fileBuffer], { type: mimeType });
    const formData = new FormData();
    formData.append("file", blob, fileName);

    const res = await fetch(`${this.apiBase}/upload`, {
      method: "POST",
      headers: { Authorization: this.apiKey },
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Upload failed (${res.status}): ${text}`);
    }

    return (await res.json()) as UploadedMedia;
  }

  // ---- Posts --------------------------------------------------------------

  /**
   * Create a post (schedule, publish now, or save as draft).
   */
  async createPost(payload: CreatePostPayload): Promise<unknown> {
    const res = await fetch(`${this.apiBase}/posts`, {
      method: "POST",
      headers: this.headers("application/json"),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Create post failed (${res.status}): ${text}`);
    }

    return res.json();
  }

  /**
   * Schedule a post to one or more integrations (channels).
   *
   * This is the high-level method Helena's pipeline should call.
   */
  async schedulePost(options: {
    integrationIds: string[];
    caption: string;
    mediaFiles?: string[];
    scheduledAt: string; // ISO 8601
    hashtags?: string[];
    providerType?: string; // "instagram" | "tiktok" etc.
  }): Promise<unknown> {
    // 1. Upload media files if provided
    const uploadedMedia: UploadedMedia[] = [];
    if (options.mediaFiles?.length) {
      for (const filePath of options.mediaFiles) {
        const media = await this.uploadMedia(filePath);
        uploadedMedia.push(media);
      }
    }

    // 2. Build caption with hashtags
    const hashtagString = options.hashtags?.length
      ? "\n\n" + options.hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")
      : "";
    const fullCaption = options.caption + hashtagString;

    // 3. Build post entries for each integration
    const posts: PostEntry[] = options.integrationIds.map((id) => ({
      integration: { id },
      value: [
        {
          content: fullCaption,
          ...(uploadedMedia.length ? { image: uploadedMedia } : {}),
        },
      ],
      settings: {
        __type: options.providerType ?? "instagram",
      },
    }));

    // 4. Create the scheduled post
    return this.createPost({
      type: "schedule",
      date: options.scheduledAt,
      posts,
    });
  }

  /**
   * Publish a post immediately to one or more integrations.
   */
  async publishNow(options: {
    integrationIds: string[];
    caption: string;
    mediaFiles?: string[];
    hashtags?: string[];
    providerType?: string;
  }): Promise<unknown> {
    const uploadedMedia: UploadedMedia[] = [];
    if (options.mediaFiles?.length) {
      for (const filePath of options.mediaFiles) {
        const media = await this.uploadMedia(filePath);
        uploadedMedia.push(media);
      }
    }

    const hashtagString = options.hashtags?.length
      ? "\n\n" + options.hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")
      : "";
    const fullCaption = options.caption + hashtagString;

    const posts: PostEntry[] = options.integrationIds.map((id) => ({
      integration: { id },
      value: [
        {
          content: fullCaption,
          ...(uploadedMedia.length ? { image: uploadedMedia } : {}),
        },
      ],
      settings: {
        __type: options.providerType ?? "instagram",
      },
    }));

    return this.createPost({
      type: "now",
      posts,
    });
  }
}
