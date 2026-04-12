import { supabaseAdmin } from "@/lib/supabase";
import { checkAuth, unauthorized } from "../auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "true";

  let query = supabaseAdmin
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (!all) {
    query = query.eq("status", "published");
  }

  const { data, error } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data ?? []);
}

export async function POST(request: Request) {
  if (!checkAuth(request)) return unauthorized();

  const body = (await request.json()) as {
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    category?: string;
    author?: string;
    image_url?: string;
    video_url?: string;
    status?: string;
  };

  if (!body.title || !body.slug) {
    return Response.json(
      { error: "Missing title or slug" },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .insert({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt ?? "",
      content: body.content ?? "",
      category: body.category ?? "",
      author: body.author ?? "",
      image_url: body.image_url ?? "",
      video_url: body.video_url ?? "",
      status: body.status ?? "draft",
      published_at: body.status === "published" ? now : null,
      created_at: now,
      updated_at: now,
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
    slug?: string;
    excerpt?: string;
    content?: string;
    category?: string;
    author?: string;
    image_url?: string;
    video_url?: string;
    status?: string;
  };

  if (!body.id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  const { id, ...updates } = body;

  const payload: Record<string, unknown> = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  if (updates.status === "published") {
    payload.published_at = new Date().toISOString();
  }

  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .update(payload)
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
    .from("blog_posts")
    .delete()
    .eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
