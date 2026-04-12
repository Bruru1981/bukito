import { supabaseAdmin } from "@/lib/supabase";
import { checkAuth, unauthorized } from "../auth";

export async function GET() {
  const { data: categories, error: catError } = await supabaseAdmin
    .from("menu_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (catError) {
    return Response.json({ error: catError.message }, { status: 500 });
  }

  const { data: items, error: itemError } = await supabaseAdmin
    .from("menu_items")
    .select("*")
    .order("sort_order", { ascending: true });

  if (itemError) {
    return Response.json({ error: itemError.message }, { status: 500 });
  }

  const result = (categories ?? []).map((cat) => ({
    ...cat,
    items: (items ?? []).filter((item) => item.category_id === cat.id),
  }));

  return Response.json(result);
}

export async function POST(request: Request) {
  if (!checkAuth(request)) return unauthorized();

  const body = (await request.json()) as {
    title: string;
    sort_order?: number;
    note?: string;
  };

  if (!body.title) {
    return Response.json({ error: "Missing title" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("menu_categories")
    .insert({
      title: body.title,
      sort_order: body.sort_order ?? 0,
      note: body.note ?? null,
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data, { status: 201 });
}
