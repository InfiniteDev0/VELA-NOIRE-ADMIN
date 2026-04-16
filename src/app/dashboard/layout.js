import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("better-auth.session_token");

  if (!sessionCookie?.value) {
    redirect("/login");
  }

  let res;
  try {
    res = await fetch(`${API_URL}/api/admin/me`, {
      headers: {
        cookie: `better-auth.session_token=${sessionCookie.value}`,
      },
      cache: "no-store",
    });
  } catch {
    redirect("/login");
  }

  if (!res.ok) {
    redirect("/login");
  }

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <TooltipProvider>
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}
