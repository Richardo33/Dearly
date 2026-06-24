import { cookies } from "next/headers";

export async function isAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.get("dearly_admin")?.value === "true";
}
