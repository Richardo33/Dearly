import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/src/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const { count, error } = await supabase
      .from("people")
      .select("id", { count: "exact", head: true });

    if (error) {
      return NextResponse.json(
        {
          connected: false,
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      connected: true,
      peopleCount: count ?? 0,
    });
  } catch (error) {
    return NextResponse.json(
      {
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
