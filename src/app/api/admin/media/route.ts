import { supabaseAdmin } from "@/lib/supabase";
import { checkAuth, unauthorized } from "../auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let query = supabaseAdmin
    .from("media")
    .select("*, media_categories(title)")
    .order("created_at", { ascending: false });

  if (category) {
    const { data: cat } = await supabaseAdmin
      .from("media_categories")
      .select("id")
      .eq("title", category)
      .single();

    if (cat) {
      query = query.eq("category_id", cat.id);
    }
  }

  const { data, error } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data ?? []);
}

export async function POST(request: Request) {
  if (!checkAuth(request)) return unauthorized();

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const title = (formData.get("title") as string) ?? "";
  const description = (formData.get("description") as string) ?? "";
  const tags = (formData.get("tags") as string) ?? "";
  const categoryId = (formData.get("category_id") as string) ?? null;

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `Bukito brand book/${timestamp}_${safeName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabaseAdmin.storage
    .from("media")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return Response.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = supabaseAdmin.storage
    .from("media")
    .getPublicUrl(filePath);

  const isVideo = file.type.startsWith("video/");

  const { data, error: insertError } = await supabaseAdmin
    .from("media")
    .insert({
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type,
      width: isVideo ? null : null,
      height: isVideo ? null : null,
      category_id: categoryId,
      title: title,
      description: description,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      is_favorite: false,
    })
    .select()
    .single();

  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 500 });
  }

  return Response.json(
    { ...data, public_url: urlData.publicUrl },
    { status: 201 }
  );
}

export async function PUT(request: Request) {
  if (!checkAuth(request)) return unauthorized();

  const body = (await request.json()) as {
    id: string;
    title?: string;
    description?: string;
    tags?: string[];
    category_id?: string;
    is_favorite?: boolean;
  };

  if (!body.id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  const { id, ...updates } = body;

  const { data, error } = await supabaseAdmin
    .from("media")
    .update({ ...updates, updated_at: new Date().toISOString() })
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

  const { data: media } = await supabaseAdmin
    .from("media")
    .select("file_path")
    .eq("id", id)
    .single();

  if (media?.file_path) {
    await supabaseAdmin.storage.from("media").remove([media.file_path]);
  }

  const { error } = await supabaseAdmin.from("media").delete().eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
