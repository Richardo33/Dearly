import { createSupabaseAdminClient } from "@/src/lib/supabase/server";

export type PersonPayload = {
  birthday?: string;
  description?: string;
  favorites?: {
    category?: string;
    label?: string;
    value?: string;
  }[];
  gallery?: {
    altText?: string;
    url?: string;
  }[];
  location?: string;
  name?: string;
  nickname?: string;
  photoUrl?: string;
  relationship?: string;
  status?: string;
  tags?: string[];
  wishlist?: {
    category?: string;
    priority?: string;
    status?: string;
    title?: string;
  }[];
};

export function requiredText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function syncPersonCollections(
  personId: string,
  payload: PersonPayload,
  options: { replace?: boolean } = {},
) {
  const supabase = createSupabaseAdminClient();
  const favorites = payload.favorites ?? [];
  const wishlist = payload.wishlist ?? [];
  const gallery = payload.gallery ?? [];
  const photoUrl = requiredText(payload.photoUrl);

  if (options.replace) {
    const deleteResults = await Promise.all([
      supabase.from("favorite_items").delete().eq("person_id", personId),
      supabase.from("wishlist_items").delete().eq("person_id", personId),
      supabase
        .from("media_assets")
        .delete()
        .eq("person_id", personId)
        .in("source_type", ["profile", "gallery"]),
    ]);
    const deleteError = deleteResults.find((result) => result.error)?.error;

    if (deleteError) {
      return deleteError.message;
    }
  }

  if (favorites.length > 0) {
    const { error } = await supabase.from("favorite_items").insert(
      favorites.map((item) => ({
        category: requiredText(item.category) || "Other",
        label: requiredText(item.label),
        person_id: personId,
        value: requiredText(item.value),
      })),
    );

    if (error) {
      return error.message;
    }
  }

  if (wishlist.length > 0) {
    const { error } = await supabase.from("wishlist_items").insert(
      wishlist.map((item) => ({
        category: requiredText(item.category) || "Short-term",
        person_id: personId,
        priority: requiredText(item.priority) || "Medium",
        status: requiredText(item.status) || "Planned",
        title: requiredText(item.title),
      })),
    );

    if (error) {
      return error.message;
    }
  }

  const mediaRows = [
    ...(photoUrl
      ? [
          {
            alt_text: `${requiredText(payload.name) || "Person"} profile photo`,
            person_id: personId,
            source_type: "profile",
            url: photoUrl,
          },
        ]
      : []),
    ...gallery.map((item) => ({
      alt_text: requiredText(item.altText) || null,
      person_id: personId,
      source_type: "gallery",
      url: requiredText(item.url),
    })),
  ].filter((item) => item.url);

  if (mediaRows.length > 0) {
    const { error } = await supabase.from("media_assets").insert(mediaRows);

    if (error) {
      return error.message;
    }
  }

  return null;
}
