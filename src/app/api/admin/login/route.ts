import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const code = body?.code;

  if (!code || code !== process.env.ADMIN_CODE) {
    return NextResponse.json(
      { message: "Invalid admin code" },
      { status: 401 },
    );
  }

  const cookieStore = await cookies();

  cookieStore.set("dearly_admin", "true", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ message: "Login success" });
}
