import { NextResponse } from "next/server";
import { checkAuth, unauthorized } from "../auth";

const SUPABASE_URL = "https://glmgwaywptqlzudoiwot.supabase.co";
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsbWd3YXl3cHRxbHp1ZG9pd290Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNTc5MiwiZXhwIjoyMDg5OTAxNzkyfQ.pNHfKGC6WAtnnxFXUHvM0epKFKc527s2a-BXGqRC5Yo";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsbWd3YXl3cHRxbHp1ZG9pd290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjU3OTIsImV4cCI6MjA4OTkwMTc5Mn0.F2kYymu9_t9THk2VI_g4cgpYv70oa9CVIcsCKSb0LL8";

/** DELETE — remove a file from Supabase Storage */
export async function DELETE(request: Request) {
  if (!checkAuth(request)) return unauthorized();

  const { path } = (await request.json()) as { path: string };

  if (!path || !path.startsWith("Bukito brand book/")) {
    return NextResponse.json(
      { error: "Invalid path" },
      { status: 400 }
    );
  }

  const deleteRes = await fetch(
    `${SUPABASE_URL}/storage/v1/object/media/${encodeURIComponent(path)}`,
    {
      method: "DELETE",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    }
  );

  if (!deleteRes.ok) {
    const err = await deleteRes.text();
    return NextResponse.json(
      { error: `Delete failed: ${err}` },
      { status: deleteRes.status }
    );
  }

  return NextResponse.json({ success: true });
}

/** GET — list files in a storage prefix (public, uses anon key) */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const prefix = searchParams.get("prefix");

  if (!prefix) {
    return NextResponse.json({ error: "Missing prefix parameter" }, { status: 400 });
  }

  const listRes = await fetch(
    `${SUPABASE_URL}/storage/v1/object/list/media`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({
        prefix,
        limit: 200,
        sortBy: { column: "created_at", order: "desc" },
      }),
    }
  );

  if (!listRes.ok) {
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 });
  }

  const files = (await listRes.json()) as Array<{
    name: string;
    metadata?: { size?: number; mimetype?: string };
    created_at?: string;
  }>;

  const filtered = files
    .filter((f) => f.name && !f.name.endsWith("/") && f.name !== ".emptyFolderPlaceholder")
    .map((f) => ({
      name: f.name,
      size: f.metadata?.size ?? 0,
      type: f.metadata?.mimetype ?? "",
      created_at: f.created_at ?? "",
    }));

  return NextResponse.json(filtered);
}
