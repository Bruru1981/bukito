/**
 * Canonical URLs for Bukito brand book assets on Supabase public storage.
 */

const STORAGE_BASE =
  "https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/public/media";

const BRAND_BOOK = `${STORAGE_BASE}/Bukito%20brand%20book`;

/** Stamp (snake + location ring) — primary file on storage. */
export const BUKITO_STAMP_SUPABASE = `${BRAND_BOOK}/stamps/BUKITO_Stamp.png`;

/** Legacy / alternate stamp filename if present. */
export const BUKITO_STAMP_DISTORTED_SUPABASE = `${BRAND_BOOK}/stamps/BUKITO_StampDistorted.png`;

const PHOTOS_BASE = `${BRAND_BOOK}/photos`;
const VIDEOS_BASE = `${BRAND_BOOK}/videos`;

/**
 * Resolve a journal / cover reference to a full image URL.
 * Accepts: full https URL, site path starting with `/`, or a filename.
 * Prefers local `/photos/` path since all photos exist locally and only a
 * subset is mirrored on Supabase Storage.
 */
export function resolveBrandPhoto(
  ref: string,
  fallbackFilename = "BUKITO_IG1.webp",
): string {
  const trimmed = ref?.trim();
  if (!trimmed) {
    return `/photos/${fallbackFilename}`;
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  const file = trimmed.replace(/^photos\//, "");
  return `/photos/${file}`;
}

/** Resolve a video filename to a full Supabase storage URL. */
export function resolveBrandVideo(ref: string): string {
  const trimmed = ref?.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
    return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  const file = trimmed.replace(/^videos\//, "");
  return `${VIDEOS_BASE}/${encodeURIComponent(file)}`;
}
