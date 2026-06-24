import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requiredText } from "@/src/lib/admin/people";
import { createSupabaseAdminClient } from "@/src/lib/supabase/server";

type DiaryRouteProps = {
  params: Promise<{
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

function revalidateDiaryViews(personId: string) {
  revalidatePath("/people");
  revalidatePath(`/people/${personId}`);
  revalidatePath(`/people/${personId}/diary`);
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

export async function POST(request: Request, { params }: DiaryRouteProps) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
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
  const { data, error } = await supabase
    .from("diary_entries")
    .insert({
      content,
      date,
      image_url: imageUrl || null,
      is_public: true,
      mood: requiredText(payload.mood) || "Happy",
      person_id: id,
      tags: Array.isArray(payload.tags) ? payload.tags : [],
      title,
    })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { message: error?.message ?? "Failed to create diary entry." },
      { status: 500 },
    );
  }

  const mediaError = await syncDiaryMedia({
    diaryEntryId: data.id,
    imageUrl,
    personId: id,
    title,
  });

  if (mediaError) {
    return NextResponse.json({ message: mediaError }, { status: 500 });
  }

  revalidateDiaryViews(id);
  return NextResponse.json({ id: data.id });
}
