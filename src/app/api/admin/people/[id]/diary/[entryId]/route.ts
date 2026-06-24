import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requiredText } from "@/src/lib/admin/people";
import { createSupabaseAdminClient } from "@/src/lib/supabase/server";

type DiaryEntryRouteProps = {
  params: Promise<{
    entryId: string;
    id: string;
  }>;
};

type DiaryPayload = {
  content?: string;
  date?: string;
  imageUrl?: string;
  mood?: string;
  tags?: string[];
  title?: string;
};

async function isAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.get("dearly_admin")?.value === "true";
}

function revalidateDiaryViews(personId: string, entryId?: string) {
  revalidatePath("/people");
  revalidatePath(`/people/${personId}`);
  revalidatePath(`/people/${personId}/diary`);
  if (entryId) {
    revalidatePath(`/people/${personId}/diary/${entryId}`);
  }
  revalidatePath("/diary");
  revalidatePath("/timeline");
  revalidatePath("/search");
}

async function syncDiaryMedia({
  diaryEntryId,
  imageUrl,
  personId,
  title,
}: {
  diaryEntryId: string;
  imageUrl: string;
  personId: string;
  title: string;
}) {
  const supabase = createSupabaseAdminClient();
  const { error: deleteError } = await supabase
    .from("media_assets")
    .delete()
    .eq("diary_entry_id", diaryEntryId)
    .eq("source_type", "diary");

  if (deleteError) {
    return deleteError.message;
  }

  if (!imageUrl) {
    return null;
  }

  const { error } = await supabase.from("media_assets").insert({
    alt_text: title,
    diary_entry_id: diaryEntryId,
    person_id: personId,
    source_type: "diary",
    url: imageUrl,
  });

  return error?.message ?? null;
}

export async function PATCH(
  request: Request,
  { params }: DiaryEntryRouteProps,
) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { entryId, id } = await params;
  const payload = (await request.json()) as DiaryPayload;
  const title = requiredText(payload.title) || "Untitled diary entry";
  const content = requiredText(payload.content);
  const date = requiredText(payload.date);
  const imageUrl = requiredText(payload.imageUrl);

  if (!date || !content) {
    return NextResponse.json(
      { message: "Date and story are required." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("diary_entries")
    .update({
      content,
      date,
      image_url: imageUrl || null,
      is_public: true,
      mood: requiredText(payload.mood) || "Happy",
      tags: Array.isArray(payload.tags) ? payload.tags : [],
      title,
      updated_at: new Date().toISOString(),
    })
    .eq("id", entryId)
    .eq("person_id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const mediaError = await syncDiaryMedia({
    diaryEntryId: entryId,
    imageUrl,
    personId: id,
    title,
  });

  if (mediaError) {
    return NextResponse.json({ message: mediaError }, { status: 500 });
  }

  revalidateDiaryViews(id, entryId);
  return NextResponse.json({ id: entryId });
}

export async function DELETE(
  _request: Request,
  { params }: DiaryEntryRouteProps,
) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { entryId, id } = await params;
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("diary_entries")
    .delete()
    .eq("id", entryId)
    .eq("person_id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  revalidateDiaryViews(id, entryId);
  return NextResponse.json({ message: "Diary entry deleted" });
}
