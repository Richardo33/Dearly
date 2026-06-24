import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import {
  type PersonPayload,
  requiredText,
} from "@/src/lib/admin/people";
import { createSupabaseAdminClient } from "@/src/lib/supabase/server";

async function isAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.get("dearly_admin")?.value === "true";
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as PersonPayload;
  const name = requiredText(payload.name);
  const nickname = requiredText(payload.nickname);

  if (!name || !nickname) {
    return NextResponse.json(
      { message: "Name and nickname are required." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data: person, error } = await supabase
    .from("people")
    .insert({
      birthday: requiredText(payload.birthday),
      description: requiredText(payload.description),
      location: requiredText(payload.location),
      name,
      nickname,
      photo_url: requiredText(payload.photoUrl),
      relationship: requiredText(payload.relationship) || "Other",
      status: requiredText(payload.status) || "Active",
      tags: Array.isArray(payload.tags) ? payload.tags : [],
    })
    .select("id")
    .single();

  if (error || !person) {
    return NextResponse.json(
      { message: error?.message ?? "Failed to create person." },
      { status: 500 },
    );
  }

  revalidatePath("/people");
  revalidatePath("/admin/people");
  revalidatePath("/search");
  return NextResponse.json({ id: person.id });
}
