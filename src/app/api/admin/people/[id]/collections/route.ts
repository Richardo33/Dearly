import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requiredText } from "@/src/lib/admin/people";
import { createSupabaseAdminClient } from "@/src/lib/supabase/server";

type CollectionsRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

type CollectionPayload = {
  collection?: "favorites" | "gallery" | "little-things" | "wishlist";
  items?: unknown[];
  mode?: "append" | "replace";
};

async function isAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.get("dearly_admin")?.value === "true";
}

function asRecord(value: unknown) {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function revalidatePersonViews(personId: string) {
  revalidatePath("/people");
  revalidatePath(`/people/${personId}`);
  revalidatePath("/favorites");
  revalidatePath("/wishlist");
  revalidatePath("/little-things");
  revalidatePath("/search");
}

export async function PATCH(
  request: Request,
  { params }: CollectionsRouteProps,
) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const payload = (await request.json()) as CollectionPayload;
  const supabase = createSupabaseAdminClient();
  const items = Array.isArray(payload.items) ? payload.items.map(asRecord) : [];
  const shouldReplace = payload.mode !== "append";

  if (payload.collection === "favorites") {
    if (shouldReplace) {
      const { error: deleteError } = await supabase
        .from("favorite_items")
        .delete()
        .eq("person_id", id);

      if (deleteError) {
        return NextResponse.json({ message: deleteError.message }, { status: 500 });
      }
    }

    const rows = items
      .map((item) => ({
        category: requiredText(item.category) || "Other",
        label: requiredText(item.label) || requiredText(item.value),
        person_id: id,
        value: requiredText(item.value),
      }))
      .filter((item) => item.value);

    if (rows.length > 0) {
      const { error } = await supabase.from("favorite_items").insert(rows);

      if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
    }

    revalidatePersonViews(id);
    return NextResponse.json({
      count: rows.length,
      message: `Favorites saved (${rows.length})`,
    });
  }

  if (payload.collection === "wishlist") {
    if (shouldReplace) {
      const { error: deleteError } = await supabase
        .from("wishlist_items")
        .delete()
        .eq("person_id", id);

      if (deleteError) {
        return NextResponse.json({ message: deleteError.message }, { status: 500 });
      }
    }

    const rows = items
      .map((item) => ({
        category: requiredText(item.category) || "Short-term",
        person_id: id,
        priority: requiredText(item.priority) || "Medium",
        status: requiredText(item.status) || "Planned",
        title: requiredText(item.title),
      }))
      .filter((item) => item.title);

    if (rows.length > 0) {
      const { error } = await supabase.from("wishlist_items").insert(rows);

      if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
    }

    revalidatePersonViews(id);
    return NextResponse.json({
      count: rows.length,
      message: `Wishlist saved (${rows.length})`,
    });
  }

  if (payload.collection === "gallery") {
    if (shouldReplace) {
      const { error: deleteError } = await supabase
        .from("media_assets")
        .delete()
        .eq("person_id", id)
        .eq("source_type", "gallery");

      if (deleteError) {
        return NextResponse.json({ message: deleteError.message }, { status: 500 });
      }
    }

    const rows = items
      .map((item) => ({
        alt_text: requiredText(item.altText) || null,
        person_id: id,
        source_type: "gallery",
        url: requiredText(item.url),
      }))
      .filter((item) => item.url);

    if (rows.length > 0) {
      const { error } = await supabase.from("media_assets").insert(rows);

      if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
    }

    revalidatePersonViews(id);
    return NextResponse.json({
      count: rows.length,
      message: `Gallery saved (${rows.length})`,
    });
  }

  if (payload.collection === "little-things") {
    if (shouldReplace) {
      const { error: deleteError } = await supabase
        .from("little_things")
        .delete()
        .eq("person_id", id);

      if (deleteError) {
        return NextResponse.json({ message: deleteError.message }, { status: 500 });
      }
    }

    const rows = items
      .map((item) => ({
        category: requiredText(item.category) || "Other",
        person_id: id,
        text: requiredText(item.text),
      }))
      .filter((item) => item.text);

    if (rows.length > 0) {
      const { error } = await supabase.from("little_things").insert(rows);

      if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
    }

    revalidatePersonViews(id);
    return NextResponse.json({
      count: rows.length,
      message: `Little things saved (${rows.length})`,
    });
  }

  return NextResponse.json(
    { message: "Unknown collection type." },
    { status: 400 },
  );
}
