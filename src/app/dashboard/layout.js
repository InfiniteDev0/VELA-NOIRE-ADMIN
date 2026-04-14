import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("better-auth.session_token");

  // No session at all — fast redirect
  if (!sessionCookie?.value) {
    redirect("/login");
  }

  // Verify this session belongs to an admin role
  let res;
  try {
    res = await fetch(`${API_URL}/api/admin/me`, {
      headers: {
        cookie: `better-auth.session_token=${sessionCookie.value}`,
      },
      cache: "no-store",
    });
  } catch {
    // Backend unreachable — fail closed, redirect to login
    redirect("/login");
  }

  if (!res.ok) {
    // Valid session but not an admin — back to login
    redirect("/login");
  }

  return <>{children}</>;
}
