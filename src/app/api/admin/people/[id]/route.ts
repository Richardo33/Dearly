import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { type PersonPayload, requiredText } from "@/src/lib/admin/people";
import { createSupabaseAdminClient } from "@/src/lib/supabase/server";

type PeopleRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

async function isAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.get("dearly_admin")?.value === "true";
}

function revalidatePeopleViews(personId: string) {
  revalidatePath("/people");
  revalidatePath(`/people/${personId}`);
  revalidatePath("/favorites");
  revalidatePath("/wishlist");
  revalidatePath("/little-things");
  revalidatePath("/timeline");
  revalidatePath("/diary");
  revalidatePath("/search");
}

export async function PATCH(request: Request, { params }: PeopleRouteProps) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
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
  const { error } = await supabase
    .from("people")
    .update({
      birthday: requiredText(payload.birthday),
      description: requiredText(payload.description),
      location: requiredText(payload.location),
      name,
      nickname,
      photo_url: requiredText(payload.photoUrl),
      relationship: requiredText(payload.relationship) || "Other",
      status: requiredText(payload.status) || "Active",
      tags: Array.isArray(payload.tags) ? payload.tags : [],
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  revalidatePeopleViews(id);
  return NextResponse.json({ id });
}

export async function DELETE(_request: Request, { params }: PeopleRouteProps) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("people").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  revalidatePeopleViews(id);
  return NextResponse.json({ message: "Person deleted" });
}
