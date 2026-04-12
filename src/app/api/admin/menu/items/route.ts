import { supabaseAdmin } from "@/lib/supabase";
import { checkAuth, unauthorized } from "../../auth";

export async function POST(request: Request) {
  if (!checkAuth(request)) return unauthorized();

  const body = (await request.json()) as {
    category_id: string;
    name: string;
    description?: string;
    price?: string;
    sort_order?: number;
    is_active?: boolean;
  };

  if (!body.category_id || !body.name) {
    return Response.json(
      { error: "Missing category_id or name" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .insert({
      category_id: body.category_id,
      name: body.name,
      description: body.description ?? "",
      price: body.price ?? "",
      sort_order: body.sort_order ?? 0,
      is_active: body.is_active ?? true,
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
    name?: string;
    description?: string;
    price?: string;
    sort_order?: number;
    is_active?: boolean;
  };

  if (!body.id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  const { id, ...updates } = body;

  const { data, error } = await supabaseAdmin
    .from("menu_items")
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
    .from("menu_items")
    .delete()
    .eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
