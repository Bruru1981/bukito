import { supabaseAdmin } from "@/lib/supabase";
import { checkAuth, unauthorized } from "../auth";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("playlists")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data ?? []);
}

export async function POST(request: Request) {
  if (!checkAuth(request)) return unauthorized();

  const body = (await request.json()) as {
    title: string;
    description?: string;
    track_count?: number;
    duration?: string;
    spotify_url?: string;
    color?: string;
    sort_order?: number;
  };

  if (!body.title) {
    return Response.json({ error: "Missing title" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("playlists")
    .insert({
      title: body.title,
      description: body.description ?? "",
      track_count: body.track_count ?? 0,
      duration: body.duration ?? "",
      spotify_url: body.spotify_url ?? "",
      color: body.color ?? "#6D0000",
      sort_order: body.sort_order ?? 0,
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data, { status: 201 });
}

export async function PUT(request: Request) {
  if (!checkAuth(request)) return unauthorized();

  const body = (await request.json()) as {
    id: string;
    title?: string;
    description?: string;
    track_count?: number;
    duration?: string;
    spotify_url?: string;
    color?: string;
    sort_order?: number;
  };

  if (!body.id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  const { id, ...updates } = body;

  const { data, error } = await supabaseAdmin
    .from("playlists")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

export async function DELETE(request: Request) {
  if (!checkAuth(request)) return unauthorized();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("playlists")
    .delete()
    .eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
