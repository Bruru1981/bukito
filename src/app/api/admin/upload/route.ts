import { NextResponse } from "next/server";
import { checkAuth, unauthorized } from "../auth";

/** Allow large uploads (videos) — increase timeout */
export const maxDuration = 60;

const SUPABASE_URL = "https://glmgwaywptqlzudoiwot.supabase.co";
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsbWd3YXl3cHRxbHp1ZG9pd290Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNTc5MiwiZXhwIjoyMDg5OTAxNzkyfQ.pNHfKGC6WAtnnxFXUHvM0epKFKc527s2a-BXGqRC5Yo";

const VALID_FOLDERS = [
  "logos",
  "wordmarks",
  "icons",
  "stamps",
  "patterns",
  "photos",
  "videos",
] as const;

export async function POST(request: Request) {
  if (!checkAuth(request)) return unauthorized();

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = formData.get("folder") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!folder || !VALID_FOLDERS.includes(folder as (typeof VALID_FOLDERS)[number])) {
    return NextResponse.json(
      { error: `Invalid folder. Must be one of: ${VALID_FOLDERS.join(", ")}` },
      { status: 400 }
    );
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `Bukito brand book/${folder}/${safeName}`;
  const fileBytes = new Uint8Array(await file.arrayBuffer());

  const uploadRes = await fetch(
    `${SUPABASE_URL}/storage/v1/object/media/${encodeURIComponent(storagePath)}`,
    {
      method: "POST",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": file.type || "application/octet-stream",
      },
      body: fileBytes,
    }
  );

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    return NextResponse.json(
      { error: `Upload failed: ${err}` },
      { status: uploadRes.status }
    );
  }

  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/media/${storagePath
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/")}`;

  return NextResponse.json({
    filename: safeName,
    path: storagePath,
    url: publicUrl,
    folder,
  });
}
