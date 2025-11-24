"use client";
import * as React from "react";
import { MessagesSquare, LogOut } from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ThreadList } from "@/components/assistant-ui/thread-list";

export function ThreadListSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [email, setEmail] = React.useState<string | null>(null);
  React.useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(async (r) => (r.ok ? r.json() : null))
      .then((d) => setEmail(d?.email ?? null))
      .catch(() => setEmail(null));
  }, []);

  async function onLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include", keepalive: true });
    } finally {
      window.location.href = "/auth/login";
    }
  }
  return (
    <Sidebar {...props}>
      <SidebarHeader className="aui-sidebar-header mb-2 border-b">
        <div className="aui-sidebar-header-content flex items-center justify-between">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link
                  href="https://assistant-ui.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="aui-sidebar-header-icon-wrapper flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <MessagesSquare className="aui-sidebar-header-icon size-4" />
                  </div>
                  <div className="aui-sidebar-header-heading mr-6 flex flex-col gap-0.5 leading-none">
                    <span className="aui-sidebar-header-title font-semibold">
                      assistant-ui
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarHeader>
      <SidebarContent className="aui-sidebar-content px-2">
        <ThreadList />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter className="aui-sidebar-footer border-t">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="text-sm">{email ? email[0]?.toUpperCase() : "?"}</span>
          </div>
          <div className="text-sm leading-tight">
            <div className="font-semibold">Profile</div>
            <div className="text-muted-foreground">{email ?? "Guest"}</div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
import { Button } from "@/components/ui/button";
