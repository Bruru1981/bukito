import { supabaseAdmin } from "@/lib/supabase";
import { checkAuth, unauthorized } from "../auth";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("*");

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const settings: Record<string, unknown> = {};
  for (const row of data ?? []) {
    settings[row.key as string] = row.value;
  }

  return Response.json(settings);
}

export async function PUT(request: Request) {
  if (!checkAuth(request)) return unauthorized();

  const body = (await request.json()) as { key: string; value: unknown };

  if (!body.key) {
    return Response.json({ error: "Missing key" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .upsert(
      { key: body.key, value: body.value, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    )
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}
